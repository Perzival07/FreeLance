import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    // Original price (MRP); shown struck through when higher than price
    mrp: { type: Number, min: 0 },
    image: { type: Array, required: true },
    category:{ type: String, required: true },
    subCategory:{ type: String, required: true},
    dimensions:{ 
        length: { type: Number, required: true },
        breadth: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    bestseller:{ type: Boolean, default: false },
    date:{ type: Date, required: true },
    stock: { type: Number, default: 0, min: 0 },
    // Optional specifications shown on the product page
    material: { type: String, trim: true, maxlength: 200 },
    colors: { type: [String], default: [] },
    seating: { type: String, trim: true, maxlength: 50 },
    warranty: { type: String, trim: true, maxlength: 100 },
    madeToOrder: { type: Boolean, default: false },
    frame: { type: String, trim: true, maxlength: 200 },
    foamDensity: { type: String, trim: true, maxlength: 100 },
    finish: { type: String, trim: true, maxlength: 200 },
    weight: { type: String, trim: true, maxlength: 50 },
    // Short label on product cards, e.g. "Festive offer"
    badge: { type: String, trim: true, maxlength: 30 },
    // Optional custom URL text and search-engine title/description
    slug: { type: String, trim: true, lowercase: true, maxlength: 80 },
    seoTitle: { type: String, trim: true, maxlength: 70 },
    seoDescription: { type: String, trim: true, maxlength: 170 },
});

productSchema.index({ category: 1, subCategory: 1, date: -1 });

const productModel = mongoose.models.product || mongoose.model('product', productSchema); 

export default productModel;
