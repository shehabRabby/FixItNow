import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

router.post(
  "/create-review",
  auth("CUSTOMER"),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview,
);
//anyone can see
router.get("/", ReviewController.getAllReviews);

export const ReviewRoutes = router;
