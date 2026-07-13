import { z } from "zod";

const createBookingValidationSchema = z.object({
  body: z.object({
    serviceId: z.string({
      message: "Service ID is required and must be a string",
    }).uuid("Invalid Service ID format"),
    timeSlot: z.string({
      message: "Time slot is required and must be a string",
    }),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
};