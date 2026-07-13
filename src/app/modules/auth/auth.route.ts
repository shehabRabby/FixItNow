import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.get(
  "/me",
  auth("CUSTOMER", "TECHNICIAN", "ADMIN"),
  AuthController.getMyProfile,
);

export const AuthRoutes = router;
