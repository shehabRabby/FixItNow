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
const updateServiceValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    duration: z.string().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

export const ServiceValidation = {
  createServiceValidationSchema,updateServiceValidationSchema
};
