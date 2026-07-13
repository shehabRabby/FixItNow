import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).min(2).max(50),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "TECHNICIAN", "ADMIN"] as const, {
      message: "Role is required and must be CUSTOMER, TECHNICIAN, or ADMIN",
    }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
};
