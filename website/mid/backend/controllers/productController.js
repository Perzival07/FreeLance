import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';
import reviewModel from '../models/reviewModel.js';



// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, length, breadth, height, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];
        const image6 = req.files.image6 && req.files.image6[0];
        const image7 = req.files.image7 && req.files.image7[0];
        const image8 = req.files.image8 && req.files.image8[0];
        const image9 = req.files.image9 && req.files.image9[0];
        const image10 = req.files.image10 && req.files.image10[0];

        const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10].filter((item) => item !== undefined);

        // Validate at least one image is uploaded
        if (images.length === 0) {
            return res.json({ success: false, message: "Please upload at least one image" });
        }


        let imagesUrl = await Promise.all(

            images.map(async (item) => {
                const dataUri = `data:${item.mimetype};base64,${item.buffer.toString("base64")}`;
                const result = await cloudinary.uploader.upload(dataUri, { resource_type: "image" });
                return result.secure_url;
            })
        )


        const numLength = Number(length);
        const numBreadth = Number(breadth);
        const numHeight = Number(height);

        const stockRaw = Number(req.body.stock);
        const stockNum = Number.isFinite(stockRaw) ? Math.max(0, Math.floor(stockRaw)) : 0;

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            dimensions: {
                length: numLength,
                breadth: numBreadth,
                height: numHeight
            },
            image: imagesUrl,
            date: Date.now(),
            stock: stockNum,
            ...parseOptionalFields(req.body),
        }
        if (!productData.slug) delete productData.slug;

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully" });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}





// Optional spec fields shared by add and update
const parseOptionalFields = (body) => {
    const out = {};
    if (body.mrp !== undefined && body.mrp !== '') {
        const mrp = Number(body.mrp);
        if (Number.isFinite(mrp) && mrp > 0) out.mrp = mrp;
    }
    for (const key of ['material', 'seating', 'warranty', 'frame', 'foamDensity', 'finish', 'weight', 'badge', 'seoTitle', 'seoDescription']) {
        if (body[key] !== undefined) out[key] = String(body[key]).trim();
    }
    if (body.slug !== undefined) {
        out.slug = String(body.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
    }
    if (body.colors !== undefined) {
        const list = Array.isArray(body.colors) ? body.colors : String(body.colors).split(',');
        out.colors = list.map((c) => String(c).trim()).filter(Boolean).slice(0, 20);
    }
    if (body.madeToOrder !== undefined) {
        out.madeToOrder = body.madeToOrder === true || body.madeToOrder === 'true';
    }
    return out;
};

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listParam = (value) =>
    String(value || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

const SORTS = {
    new: { date: -1 },
    'price-asc': { price: 1, date: -1 },
    'price-desc': { price: -1, date: -1 },
    bestseller: { bestseller: -1, date: -1 },
};

// Adds avgRating / reviewCount to each product (one query for the whole page)
const attachRatings = async (products) => {
    if (!products.length) return products;
    const ids = products.map((p) => String(p._id));
    const stats = await reviewModel.aggregate([
        { $match: { productId: { $in: ids } } },
        { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const byId = new Map(stats.map((s) => [s._id, s]));
    return products.map((p) => {
        const s = byId.get(String(p._id));
        return {
            ...p,
            avgRating: s ? Math.round(s.avg * 10) / 10 : 0,
            reviewCount: s ? s.count : 0,
        };
    });
};

// function for list product (paginated, filtered and sorted on the server)
// Query: page, limit, q, category, subCategory (comma lists), minPrice, maxPrice,
//        inStock=true, bestseller=true, exclude=<id>, sort=new|price-asc|price-desc|bestseller
const listProducts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limitRaw = parseInt(req.query.limit, 10);
        const limit = Number.isFinite(limitRaw) && limitRaw > 0
            ? Math.min(limitRaw, 100)
            : 20;
        const skip = (page - 1) * limit;

        const filter = {};
        const categories = listParam(req.query.category);
        const subCategories = listParam(req.query.subCategory);
        if (categories.length) filter.category = { $in: categories };
        if (subCategories.length) filter.subCategory = { $in: subCategories };

        const q = String(req.query.q || '').trim().slice(0, 100);
        if (q) {
            const rx = new RegExp(escapeRegex(q), 'i');
            filter.$or = [{ name: rx }, { category: rx }, { subCategory: rx }, { material: rx }];
        }

        const minPrice = Number(req.query.minPrice);
        const maxPrice = Number(req.query.maxPrice);
        if (Number.isFinite(minPrice) && minPrice > 0) filter.price = { ...filter.price, $gte: minPrice };
        if (Number.isFinite(maxPrice) && maxPrice > 0) filter.price = { ...filter.price, $lte: maxPrice };

        if (req.query.inStock === 'true') {
            filter.$and = [...(filter.$and || []), { $or: [{ stock: { $gt: 0 } }, { madeToOrder: true }] }];
        }
        if (req.query.bestseller === 'true') filter.bestseller = true;
        if (req.query.onSale === 'true') {
            filter.$expr = { $gt: [{ $ifNull: ['$mrp', 0] }, '$price'] };
        }
        const materials = listParam(req.query.material);
        if (materials.length) {
            filter.$and = [...(filter.$and || []), { $or: materials.map((m) => ({ material: new RegExp(escapeRegex(m), 'i') })) }];
        }
        const seating = listParam(req.query.seating);
        if (seating.length) filter.seating = { $in: seating };
        const colors = listParam(req.query.color);
        if (colors.length) filter.colors = { $in: colors.map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i')) };
        if (req.query.exclude && mongoose.Types.ObjectId.isValid(req.query.exclude)) {
            filter._id = { $ne: req.query.exclude };
        }

        const sort = SORTS[req.query.sort] || SORTS.new;

        const [products, totalProducts] = await Promise.all([
            productModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .maxTimeMS(5000)
                .lean(),
            productModel.countDocuments(filter, { maxTimeMS: 5000 }),
        ]);

        res.json({
            success: true,
            products: await attachRatings(products),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit) || 1,
                totalProducts,
                limit,
            },
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message || "Failed to fetch products. Please check database connection.",
        });
    }
};

// Categories / types that actually have products, plus the price range — drives the storefront filters
const productFacets = async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=300');
        const [categories, subCategories, priceRange, combos, materials, seating, colors, saleCount] = await Promise.all([
            productModel.aggregate([
                { $sort: { bestseller: -1, date: -1 } },
                { $group: { _id: '$category', count: { $sum: 1 }, image: { $first: { $arrayElemAt: ['$image', 0] } } } },
                { $sort: { _id: 1 } },
            ]),
            productModel.aggregate([
                { $sort: { bestseller: -1, date: -1 } },
                { $group: { _id: '$subCategory', count: { $sum: 1 }, image: { $first: { $arrayElemAt: ['$image', 0] } } } },
                { $sort: { _id: 1 } },
            ]),
            productModel.aggregate([{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }]),
            // one photo per room + type pair, e.g. a sofa for "Living Room"
            productModel.aggregate([
                { $sort: { bestseller: -1, date: -1 } },
                { $group: { _id: { category: '$category', subCategory: '$subCategory' }, image: { $first: { $arrayElemAt: ['$image', 0] } } } },
            ]),
            productModel.distinct('material', { material: { $nin: [null, ''] } }),
            productModel.distinct('seating', { seating: { $nin: [null, ''] } }),
            productModel.aggregate([
                { $unwind: '$colors' },
                { $group: { _id: { $toLower: '$colors' }, name: { $first: '$colors' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 30 },
            ]),
            productModel.countDocuments({ $expr: { $gt: [{ $ifNull: ['$mrp', 0] }, '$price'] } }),
        ]);
        res.json({
            success: true,
            categories: categories.map((c) => ({ name: c._id, count: c.count, image: c.image })),
            subCategories: subCategories.map((c) => ({ name: c._id, count: c.count, image: c.image })),
            price: { min: priceRange[0]?.min ?? 0, max: priceRange[0]?.max ?? 0 },
            combos: combos.map((c) => ({ category: c._id.category, subCategory: c._id.subCategory, image: c.image })),
            materials: materials.sort(),
            seating: seating.sort(),
            colors: colors.map((c) => c.name),
            saleCount,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Several products by id (cart / wishlist / recently viewed)
const productsByIds = async (req, res) => {
    try {
        const ids = (Array.isArray(req.body.ids) ? req.body.ids : [])
            .map(String)
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .slice(0, 100);
        if (!ids.length) return res.json({ success: true, products: [] });
        const products = await productModel.find({ _id: { $in: ids } }).lean();
        res.json({ success: true, products: await attachRatings(products) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for removing product 
const removeProduct = async (req, res) => {

    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}




// function for single product info
const singleProduct = async (req, res) => {

    try {
        const { productId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ success: false, message: "Product not found" });
        }
        const product = await productModel.findById(productId).lean();
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        const [withRating] = await attachRatings([product]);
        res.json({ success: true, product: withRating });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    } 
}



// function to update bestseller status
const updateBestseller = async (req, res) => {
    try {
        const { id, bestseller } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const product = await productModel.findByIdAndUpdate(
            id,
            { bestseller: bestseller === true || bestseller === "true" },
            { new: true }
        );

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ 
            success: true, 
            message: `Product ${bestseller === true || bestseller === "true" ? "marked as" : "removed from"} bestseller`,
            product 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function to edit product details (images are kept as they are)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Product not found" });
        }
        const update = parseOptionalFields(req.body);
        for (const key of ['name', 'description', 'category', 'subCategory']) {
            if (req.body[key] !== undefined) update[key] = String(req.body[key]).trim();
        }
        if (req.body.price !== undefined) update.price = Number(req.body.price);
        if (req.body.stock !== undefined) update.stock = Math.max(0, Math.floor(Number(req.body.stock) || 0));
        if (req.body.bestseller !== undefined) update.bestseller = req.body.bestseller === true || req.body.bestseller === 'true';
        if (req.body.length !== undefined) {
            update.dimensions = {
                length: Number(req.body.length),
                breadth: Number(req.body.breadth),
                height: Number(req.body.height),
            };
        }
        // mrp: '' clears it
        const unset = req.body.mrp === '' || req.body.mrp === 0 ? { mrp: 1 } : undefined;
        const product = await productModel.findByIdAndUpdate(
            id,
            unset ? { $set: update, $unset: unset } : { $set: update },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Product updated", product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { productFacets, productsByIds, updateProduct, listProducts, addProduct, removeProduct, singleProduct, updateBestseller };
