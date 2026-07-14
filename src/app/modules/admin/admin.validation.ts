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

export const AdminValidation = {
  updateUserStatusValidationSchema,
  updateUserRoleValidationSchema,
};