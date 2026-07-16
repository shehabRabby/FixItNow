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

router.get("/", ServiceController.getAllServices);
router.get("/:id", ServiceController.getSingleService);
router.delete(
  "/:id",
  auth("TECHNICIAN", "ADMIN"),
  ServiceController.deleteService,
);

router.patch(
  "/:id",
  auth("TECHNICIAN", "ADMIN"),
  validateRequest(ServiceValidation.updateServiceValidationSchema),
  ServiceController.updateService,
);

export const ServiceRoutes = router;
