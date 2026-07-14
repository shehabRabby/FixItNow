import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";
import {
  PaymentProvider,
  PaymentStatus,
} from "../../../../generated/prisma/enums";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createPaymentIntentInDB = async (
  customerId: string,
  payload: { bookingId: string },
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
    include: {
      service: true,
      payment: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found!");
  }

  // check if the booking belongs to the customer
  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to pay for this booking!");
  }

  // is accepted booking status check
  if (booking.status !== "ACCEPTED") {
    throw new Error(
      `You can only pay for bookings that are ACCEPTED. Current status: ${booking.status}`,
    );
  }

  if (booking.payment && booking.payment.status === PaymentStatus.COMPLETED) {
    throw new Error("This booking has already been paid for!");
  }

  const amountInCents = Math.round(booking.service.price * 100);

  // stripe payment intent made
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: {
      bookingId: booking.id,
      customerId: customerId,
    },
  });

  const transactionId = paymentIntent.id;

  // if payment record already exists, update it; otherwise, create a new one
  const paymentData = await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: {
      amount: booking.service.price,
      transactionId,
      status: PaymentStatus.PENDING,
    },
    create: {
      bookingId: booking.id,
      amount: booking.service.price,
      method: "CARD",
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
      transactionId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    payment: paymentData,
  };
};

const confirmPaymentInDB = async (
  customerId: string,
  payload: { bookingId: string; transactionId: string },
) => {
  const { bookingId, transactionId } = payload;

  const payment = await prisma.payment.findUnique({
    where: { bookingId },
    include: { booking: true },
  });

  if (!payment) {
    throw new Error("Payment record not found for this booking!");
  }

  // check owner of the booking
  if (payment.booking.customerId !== customerId) {
    throw new Error(
      "You are not authorized to confirm payment for this booking!",
    );
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    throw new Error("This payment is already confirmed and completed!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { bookingId },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId: transactionId, // record the transaction ID from Stripe
        paidAt: new Date(),
      },
    });

    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "PAID",
      },
    });

    return { payment: updatedPayment, booking: updatedBooking };
  });

  return result;
};

export const PaymentService = {
  createPaymentIntentInDB,
  confirmPaymentInDB,
};
