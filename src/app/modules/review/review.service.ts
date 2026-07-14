import { prisma } from "../../../lib/prisma";

const createReviewInDB = async (
  customerId: string,
  payload: { bookingId: string; rating: number; comment: string },
) => {
  // if booking exists or not
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found!");
  }

  // is it customer's booking or not
  if (booking.customerId !== customerId) {
    throw new Error("You are not authorized to review this booking!");
  }

  //is it completed or not
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review a booking after it is COMPLETED!");
  }

  // check if the customer has already submitted a review for this booking
  const existingReview = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId },
  });

  if (existingReview) {
    throw new Error("You have already submitted a review for this booking!");
  }

  //
  const technicianProfileId = booking.service.technicianProfileId;
  if (!technicianProfileId) {
    throw new Error("No technician is assigned to this service to review!");
  }

  const result = await prisma.review.create({
    data: {
      bookingId: payload.bookingId,
      customerId,
      technicianProfileId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: true,
      technicianProfile: true,
    },
  });

  return result;
};

const getAllReviewsFromDB = async (query: {
  customerId?: string;
  technicianProfileId?: string;
}) => {
  const { customerId, technicianProfileId } = query;

  const findConditions: any = {};

  if (customerId) {
    findConditions.customerId = customerId;
  }

  if (technicianProfileId) {
    findConditions.technicianProfileId = technicianProfileId;
  }

  const result = await prisma.review.findMany({
    where: findConditions,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      technicianProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const ReviewService = {
  createReviewInDB,
  getAllReviewsFromDB,
};
