import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

const getDashboardOverviewFromDB = async () => {
  const [
    totalUsers,
    totalBookings,
    bookingsGroupedByStatus,
    totalServices,
    completedBookingsWithPrice,
  ] = await Promise.all([
    // total registered users
    prisma.user.count(),

    // total bookings made
    prisma.booking.count(),

    // total bookings grouped by status
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),

    // total services offered
    prisma.service.count(),

    // total revenue
    prisma.booking.findMany({
      where: {
        status: "COMPLETED",
      },
      include: {
        service: true,
      },
    }),
  ]);

  // Calculate total revenue from completed bookings
  const totalRevenue = completedBookingsWithPrice.reduce(
    (sum, booking) => sum + (booking.service?.price || 0),
    0,
  );

  const bookingStatusOverview = bookingsGroupedByStatus.reduce(
    (acc, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalUsers,
    totalBookings,
    totalServices,
    totalRevenue,
    bookingStatusOverview,
  };
};

// change user status (ACTIVE/BLOCKED)
const updateUserStatusInDB = async (id: string, status: UserStatus) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new Error("User not found!");
  }

  const result = await prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return result;
};

// change user role (Customer/Technician/Admin)
const updateUserRoleInDB = async (id: string, role: UserRole) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new Error("User not found!");
  }

  if (isUserExist.status === "BANNED") {
    throw new Error(
      "Cannot change the role of a BANNED user! Unban them first.",
    );
  }

  const result = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return result;
};

export const AdminService = {
  getDashboardOverviewFromDB,
  updateUserStatusInDB,
  updateUserRoleInDB,
};
