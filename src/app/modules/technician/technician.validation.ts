import { z } from "zod";

const updateTechnicianValidationSchema = z.object({
  body: z.object({
    skills: z
      .array(
        z.string({
          message: "Each skill must be a string",
        }),
      )
      .optional(),
    experienceYears: z
      .number({
        message: "Experience years must be a number",
      })
      .int("Experience years must be an integer")
      .min(0, "Experience years cannot be negative")
      .optional(),
    bio: z
      .string()
      .max(500, "Bio cannot be more than 500 characters")
      .optional(),
    availabilitySlots: z
      .string({
        message: "Availability slots must be a string",
      })
      .optional(),
  }),
});

export const TechnicianValidation = {
  updateTechnicianValidationSchema,
};
