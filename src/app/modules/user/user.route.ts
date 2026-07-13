import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";

const router = express.Router();

router.post(
  "/register",
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

export const UserRoutes = router;
