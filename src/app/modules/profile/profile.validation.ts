import { z } from "zod";

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    profileImg: z.string().url("Invalid image URL format").optional(),
  }),
});

export const ProfileValidation = {
  updateProfileValidationSchema,
};