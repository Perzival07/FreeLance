import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { uploadToCloudinary } from "../utils/uploadImages.js";

const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ success: false, message: "Invalid product" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const r = Number(rating);
        if (!Number.isInteger(r) || r < 1 || r > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const text = String(comment || "").trim();
        if (text.length < 3) {
            return res.json({ success: false, message: "Comment is too short" });
        }

        const user = await userModel.findById(userId).select("name");
        const userName = user?.name?.trim() || "Customer";

        const existing = await reviewModel.findOne({
            productId: String(productId),
            userId: String(userId),
        });
        if (existing) {
            return res.json({
                success: false,
                message: "You have already reviewed this product",
            });
        }

        const bought = await orderModel.exists({
            userId: String(userId),
            "items._id": String(productId),
            status: { $ne: "Cancelled" },
        });
        const images = req.files?.length ? await uploadToCloudinary(req.files, "reviews") : [];

        await reviewModel.create({
            productId: String(productId),
            userId: String(userId),
            userName,
            rating: r,
            comment: text,
            images,
            verified: Boolean(bought),
        });

        res.json({ success: true, message: "Review added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ success: false, message: "Invalid product" });
        }

        const reviews = await reviewModel
            .find({ productId: String(productId), hidden: { $ne: true } })
            .sort({ createdAt: -1 })
            .lean();

        const total = reviews.length;
        const avgRating =
            total === 0
                ? 0
                : reviews.reduce((sum, doc) => sum + doc.rating, 0) / total;

        res.json({
            success: true,
            reviews,
            avgRating: Math.round(avgRating * 10) / 10,
            total,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Recent 4–5 star reviews for the homepage, with the product they belong to
const getLatestReviews = async (req, res) => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 12);
        const reviews = await reviewModel
            .find({ rating: { $gte: 4 }, comment: { $exists: true }, hidden: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        const ids = reviews.map((r) => r.productId).filter((id) => mongoose.Types.ObjectId.isValid(id));
        const products = await productModel.find({ _id: { $in: ids } }, { name: 1, image: 1 }).lean();
        const byId = new Map(products.map((p) => [String(p._id), p]));
        res.set('Cache-Control', 'public, max-age=300');
        res.json({
            success: true,
            reviews: reviews.map((r) => {
                const p = byId.get(r.productId);
                return {
                    _id: r._id,
                    userName: r.userName,
                    rating: r.rating,
                    comment: r.comment,
                    createdAt: r.createdAt,
                    images: r.images || [],
                    verified: Boolean(r.verified),
                    product: p ? { _id: p._id, name: p.name, image: p.image?.[0] } : null,
                };
            }),
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: all reviews with product names, newest first
const listAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({}).sort({ createdAt: -1 }).limit(500).lean();
        const ids = [...new Set(reviews.map((r) => r.productId))].filter((id) => mongoose.Types.ObjectId.isValid(id));
        const products = await productModel.find({ _id: { $in: ids } }, { name: 1, image: 1 }).lean();
        const byId = new Map(products.map((p) => [String(p._id), p]));
        res.json({
            success: true,
            reviews: reviews.map((r) => ({ ...r, product: byId.get(r.productId) || null })),
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const setReviewHidden = async (req, res) => {
    try {
        const { id, hidden } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.json({ success: false, message: "Invalid review" });
        await reviewModel.findByIdAndUpdate(id, { hidden: hidden === true || hidden === "true" });
        res.json({ success: true, message: hidden ? "Review hidden" : "Review visible" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removeReview = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.json({ success: false, message: "Invalid review" });
        await reviewModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Review deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addReview, getProductReviews, getLatestReviews, listAllReviews, setReviewHidden, removeReview };
