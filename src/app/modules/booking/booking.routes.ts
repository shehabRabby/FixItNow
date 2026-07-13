import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";

const router = express.Router();

router.post(
  "/create-booking",
  auth("CUSTOMER"),
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingController.createBooking,
);

// only customer and technician can see bookings
router.get(
  "/",
  auth("CUSTOMER", "TECHNICIAN"),
  BookingController.getAllBookings,
);

router.patch(
  "/:id/status",
  auth("TECHNICIAN", "ADMIN"),
  BookingController.updateBookingStatus
);

// only customer can cancel their booking
router.patch(
  "/:id/cancel",
  auth("CUSTOMER"),
  BookingController.cancelBooking
);


export const BookingRoutes = router;
