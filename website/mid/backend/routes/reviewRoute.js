import express from "express";
import { addReview, getProductReviews, getLatestReviews } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.get("/latest", getLatestReviews);
reviewRouter.post("/add", authUser, addReview);

export default reviewRouter;
