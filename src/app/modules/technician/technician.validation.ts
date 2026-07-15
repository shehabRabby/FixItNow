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
      .array(
        z.string({
          message: "Each time slot must be a valid string",
        }),
      )
      .optional(),
  }),
});

const updateAvailabilitySlotsValidationSchema = z.object({
  body: z.object({
    availabilitySlots: z
      .array(
        z.string({
          message: "Each time slot must be a valid string",
        }),
        {
          message: "Availability slots must be a valid list of times",
        },
      )
      .min(1, "At least one availability slot must be provided"),
  }),
});

export const TechnicianValidation = {
  updateTechnicianValidationSchema,
  updateAvailabilitySlotsValidationSchema,
};
