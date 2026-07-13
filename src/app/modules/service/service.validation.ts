import { z } from "zod";

const createServiceValidationSchema = z.object({
  body: z.object({
    title: z.string({
      message: "Title is required and must be a string",
    }),
    description: z.string({
      message: "Description is required and must be a string",
    }),
    price: z
      .number({
        message: "Price is required and must be a number",
      })
      .min(0, "Price cannot be negative"),
    location: z.string({
      message: "Location is required and must be a string",
    }),
    categoryId: z
      .string({
        message: "Category ID is required and must be a string",
      })
      .uuid("Invalid Category ID format"),
  }),
});

export const ServiceValidation = {
  createServiceValidationSchema,
};
