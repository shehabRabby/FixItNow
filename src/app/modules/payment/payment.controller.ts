import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const bookingData = req.body;

  const result = await PaymentService.createPaymentIntentInDB(
    customerId,
    bookingData,
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Payment intent created successfully!",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id as string;
  const paymentConfirmData = req.body;

  const result = await PaymentService.confirmPaymentInDB(
    customerId,
    paymentConfirmData,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Payment confirmed and booking marked as PAID successfully!",
    data: result,
  });
});

const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const role = req.user?.role as string;

  const result = await PaymentService.getPaymentHistoryFromDB(userId, role);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Payment history fetched successfully!",
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
};
