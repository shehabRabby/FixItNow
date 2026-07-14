import { BookingStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

const createBookingInDB = async (
  customerId: string,
  bookingData: { serviceId: string; timeSlot: string },
) => {
  const isServiceExist = await prisma.service.findUnique({
    where: { id: bookingData.serviceId },
  });

  if (!isServiceExist) {
    throw new Error("Requested service not found!");
  }

  const result = await prisma.booking.create({
    data: {
      customerId,
      serviceId: bookingData.serviceId,
      timeSlot: bookingData.timeSlot,
    },
    include: {
      service: true,
      payment: true,
      review: true,
    },
  });

  return result;
};

const getSingleBookingFromDB = async (id: string, currentUser: any) => {
  const result = await prisma.booking.findUnique({
    where: { id },
  });

  if (!result) {
    throw new Error("Booking not found!");
  }

  // if the current user is not an admin and is not the owner of the booking, throw an error
  if (currentUser.role !== "ADMIN" && result.customerId !== currentUser.id) {
    throw new Error("You are not authorized to view this booking!");
  }

  return result;
};

const getAllBookingsFromDB = async (userId: string, role: string) => {
  let result;

  if (role === "CUSTOMER") {
    result = await prisma.booking.findMany({
      where: { customerId: userId },
      include: { service: true, payment: true, review: true },
    });
  } else if (role === "TECHNICIAN") {
    // only technician can see bookings related to their services
    result = await prisma.booking.findMany({
      where: {
        service: {
          technicianProfile: { userId: userId },
        },
      },
      include: { service: true, payment: true, review: true },
    });
  } else {
    // Only admin can see all bookings
    result = await prisma.booking.findMany({
      include: { service: true, payment: true, review: true },
    });
  }

  return result;
};

const updateBookingStatusInDB = async (
  id: string,
  status: string,
  currentUser: any,
) => {
  const isBookingExist = await prisma.booking.findUnique({
    where: { id },
  });

  if (!isBookingExist) {
    throw new Error("Booking not found!");
  }

  const validatedStatus = BookingStatus[status as keyof typeof BookingStatus];
  if (!validatedStatus) {
    throw new Error(
      `Invalid status value provided! Expected one of: ${Object.keys(BookingStatus).join(", ")}`,
    );
  }

  // if booking is already COMPLETED, it cannot be changed to any other status
  if (isBookingExist.status === "COMPLETED") {
    throw new Error(
      "Cannot change the status of an already COMPLETED booking!",
    );
  }

  // Role-Based Authorization
  // customer does not have permission to set status to ACCEPTED or COMPLETED
  if (
    currentUser.role === "CUSTOMER" &&
    (validatedStatus === "ACCEPTED" || validatedStatus === "COMPLETED")
  ) {
    throw new Error(
      "As a CUSTOMER, you are not authorized to accept or complete a booking!",
    );
  }

  // all checks passed, proceed to update the booking status
  const result = await prisma.booking.update({
    where: { id },
    data: {
      status: validatedStatus,
    },
    include: { service: true },
  });

  return result;
};

const cancelBookingByCustomerInDB = async (id: string, customerId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new Error("Booking not found!");
  }

  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to cancel this booking!");
  }

  const result = await prisma.booking.update({
    where: { id },
    data: {
      status: BookingStatus.CANCELLED,
    },
    include: { service: true },
  });

  return result;
};

export const BookingService = {
  createBookingInDB,
  getSingleBookingFromDB,
  getAllBookingsFromDB,
  updateBookingStatusInDB,
  cancelBookingByCustomerInDB,
};
