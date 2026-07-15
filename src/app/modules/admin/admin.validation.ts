import { z } from "zod";

const updateUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "BANNED"], {
      message: "Status must be ACTIVE or BANNED",
    }),
  }),
});

const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(["CUSTOMER", "TECHNICIAN", "ADMIN"], {
      message: "Role must be CUSTOMER, TECHNICIAN, or ADMIN",
    }),
  }),
});

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Category name is required",
    }),
    description: z.string().optional(),
  }),
});

export const AdminValidation = {
  updateUserStatusValidationSchema,
  updateUserRoleValidationSchema,
  createCategoryValidationSchema
};