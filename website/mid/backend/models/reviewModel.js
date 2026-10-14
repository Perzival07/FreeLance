import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    // true when this customer has a (non-cancelled) order containing the product
    verified: { type: Boolean, default: false },
    // hidden by the admin — not shown on the site
    hidden: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const reviewModel =
    mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
