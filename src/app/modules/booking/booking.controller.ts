import { Request, Response } from "express";
import httpStatus from "http-status";
import { BookingService } from "./booking.service";
import catchAsync from "../../utils/catchAsync";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const bookingBody = req.body;

  const result = await BookingService.createBookingInDB(
    customerId,
    bookingBody,
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Booking requested successfully!",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const role = req.user?.role as string;

  const result = await BookingService.getAllBookingsFromDB(userId, role);

  const message =
    result && result.length > 0
      ? "Bookings fetched successfully!"
      : "No bookings found!";

  res.status(httpStatus.OK).json({
    success: true,
    message,
    data: result,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const currentUser = req.user;

  const result = await BookingService.getSingleBookingFromDB(id, currentUser);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Booking fetched successfully!",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const currentUser = req.user;

  const result = await BookingService.updateBookingStatusInDB(
    id,
    status,
    currentUser,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Booking status updated successfully!",
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const customerId = (req.user as any).id;
  const result = await BookingService.cancelBookingByCustomerInDB(
    id,
    customerId,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Booking cancelled successfully!",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBookingStatus,
  cancelBooking,
};
