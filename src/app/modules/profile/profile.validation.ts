import { z } from "zod";

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    profileImg: z.string().url("Invalid image URL format").optional(),
    skills: z.array(z.string()).optional(),
    experienceYears: z.number().min(0, "Experience cannot be negative").optional(),
    bio: z.string().optional(),
    availabilitySlots: z.array(z.string()).optional(),
  }),
});

export const ProfileValidation = {
  updateProfileValidationSchema,
};