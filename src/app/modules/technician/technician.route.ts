import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TechnicianController } from "./technician.controller";
import { TechnicianValidation } from "./technician.validation";

const router = express.Router();

router.get("/profile", auth("TECHNICIAN"), TechnicianController.getMyProfile);

router.patch(
  "/profile-update",
  auth("TECHNICIAN"),
  validateRequest(TechnicianValidation.updateTechnicianValidationSchema),
  TechnicianController.updateMyProfile,
);

router.patch(
  "/availability-slots",
  auth("TECHNICIAN"), // only technicians can update
  validateRequest(TechnicianValidation.updateAvailabilitySlotsValidationSchema),
  TechnicianController.updateAvailabilitySlots,
);

export const TechnicianRoutes = router;
