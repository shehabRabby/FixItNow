import { z } from "zod";

const createPaymentIntentValidationSchema = z.object({
  body: z.object({
    bookingId: z
      .string({
        message: "Booking ID is required and must be a valid string",
      })
      .uuid({
        message: "Invalid Booking ID format. It must be a valid UUID",
      }),
  }),
});

const confirmPaymentValidationSchema = z.object({
  body: z.object({
    bookingId: z
      .string({ error: "Booking ID is required" })
      .uuid({ message: "Invalid Booking ID format" }),
    transactionId: z
      .string({ error: "Transaction ID is required from Stripe" })
      .trim()
      .min(1, { message: "Transaction ID cannot be empty" }),
  }),
});

export const PaymentValidation = {
  createPaymentIntentValidationSchema,
  confirmPaymentValidationSchema,
};
