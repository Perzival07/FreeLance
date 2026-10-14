import express from "express";
import { addReview, getProductReviews, getLatestReviews, listAllReviews, setReviewHidden, removeReview } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import { acceptPhotos } from "../utils/uploadImages.js";

const reviewRouter = express.Router();

reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.get("/latest", getLatestReviews);
// photos are parsed first so authUser can add userId to the multipart body
reviewRouter.post("/add", acceptPhotos(3), authUser, addReview);

// admin moderation
reviewRouter.post("/admin/list", adminAuth, listAllReviews);
reviewRouter.post("/admin/hide", adminAuth, setReviewHidden);
reviewRouter.post("/admin/remove", adminAuth, removeReview);

export default reviewRouter;
