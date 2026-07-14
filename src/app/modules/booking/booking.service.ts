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

  const currentStatus = isBookingExist.status;

  // if the booking is already in a terminal state, it cannot be updated further
  if (
    currentStatus === "COMPLETED" ||
    currentStatus === "CANCELLED" ||
    currentStatus === "DECLINED"
  ) {
    throw new Error(
      `Cannot change the status of a booking that is already ${currentStatus}!`,
    );
  }

  if (currentStatus === "REQUESTED") {
    if (validatedStatus !== "ACCEPTED" && validatedStatus !== "DECLINED") {
      throw new Error(
        "From REQUESTED, booking can only be updated to ACCEPTED or DECLINED!",
      );
    }
  } else if (currentStatus === "ACCEPTED") {
    // if Accepted, it must be PAID before moving to next status
    if (validatedStatus !== "PAID") {
      throw new Error(
        "An ACCEPTED booking must be PAID before processing further!",
      );
    }
  } else if (currentStatus === "PAID") {
    if (validatedStatus !== "IN_PROGRESS") {
      throw new Error("A PAID booking can only be moved to IN_PROGRESS!");
    }
  } else if (currentStatus === "IN_PROGRESS") {
    if (validatedStatus !== "COMPLETED") {
      throw new Error("An IN_PROGRESS booking can only be moved to COMPLETED!");
    }
  }

  if (currentUser.role === "TECHNICIAN") {
    const serviceWithTechnician = await prisma.service.findUnique({
      where: { id: isBookingExist.serviceId },
      include: { technicianProfile: true },
    });

    if (serviceWithTechnician?.technicianProfile?.userId !== currentUser.id) {
      throw new Error(
        "You are not authorized to manage this booking as this is not your assigned job!",
      );
    }
  }

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

  const restrictCancelStates = [
    "PAID",
    "IN_PROGRESS",
    "COMPLETED",
    "DECLINED",
    "CANCELLED",
  ];

  if (restrictCancelStates.includes(booking.status)) {
    if (booking.status === "CANCELLED") {
      throw new Error("This booking has already been CANCELLED!");
    }
    throw new Error(
      `Cannot cancel a booking that is already ${booking.status}!`,
    );
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
