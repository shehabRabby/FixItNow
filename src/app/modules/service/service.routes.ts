import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceController } from "./service.controller";
import { ServiceValidation } from "./service.validation";

const router = express.Router();

router.post(
  "/create-service",
  auth("TECHNICIAN"),
  validateRequest(ServiceValidation.createServiceValidationSchema),
  ServiceController.createService,
);

export const ServiceRoutes = router;
