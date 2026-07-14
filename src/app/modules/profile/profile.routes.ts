import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();

router.get(
  "/my-profile",
  auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
  ProfileController.getMyProfile,
);

router.patch(
  "/update-profile",
  auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
  validateRequest(ProfileValidation.updateProfileValidationSchema),
  ProfileController.updateMyProfile,
);

router.get(
  "/dashboard-overview",
  auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
  ProfileController.getDashboardOverview,
);

export const ProfileRoutes = router;
