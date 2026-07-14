import { Request, Response } from "express";
import httpStatus from "http-status";
import { ReviewService } from "./review.service";
import catchAsync from "../../utils/catchAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const reviewData = req.body;

  const result = await ReviewService.createReviewInDB(customerId, reviewData);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Review submitted successfully!",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;

  const result = await ReviewService.getAllReviewsFromDB(filters);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Reviews fetched successfully!",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
};
