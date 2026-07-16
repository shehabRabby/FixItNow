import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    bookingId: z
      .string({
        error: "Booking ID is required",
      })
      .uuid({
        message: "Invalid Booking ID format. It must be a valid UUID",
      }),
    rating: z
      .number({
        error: "Rating is required",
      })
      .int({ message: "Rating must be a whole number (integer)" })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    comment: z
      .string({
        error: "Comment is required",
      })
      .trim()
      .min(3, { message: "Comment must be at least 3 characters long" }),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
