import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

router.get("/overview", auth("ADMIN"), AdminController.getDashboardOverview);

router.patch(
  "/users/:id/status",
  auth("ADMIN"),
  validateRequest(AdminValidation.updateUserStatusValidationSchema),
  AdminController.updateUserStatus,
);

router.patch(
  "/users/:id/role",
  auth("ADMIN"),
  validateRequest(AdminValidation.updateUserRoleValidationSchema),
  AdminController.updateUserRole,
);

export const AdminRoutes = router;
