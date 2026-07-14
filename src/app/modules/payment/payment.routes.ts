import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = express.Router();

router.post(
  "/create-payment-intent",
  auth("CUSTOMER"),
  validateRequest(PaymentValidation.createPaymentIntentValidationSchema),
  PaymentController.createPaymentIntent,
);

router.post(
  "/confirm-payment",
  auth("CUSTOMER"),
  validateRequest(PaymentValidation.confirmPaymentValidationSchema),
  PaymentController.confirmPayment,
);

export const PaymentRoutes = router;
