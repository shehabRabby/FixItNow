import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }),
    description: z.string({ message: "Description is required" }),
    slug: z.string({ message: "Slug is required" }),
  }),
});

export const CategoryValidation = { createCategoryValidationSchema };