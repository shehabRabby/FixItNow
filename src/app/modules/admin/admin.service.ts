import { UserRole, UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

const getDashboardOverviewFromDB = async () => {
  const [totalUsers, totalBookings, bookingsGroupedByStatus, totalServices] =
    await Promise.all([
      // total register user
      prisma.user.count(),

      // total booking
      prisma.booking.count(),

      // booking by status
      prisma.booking.groupBy({
        by: ["status"],
        _count: true,
      }),

      // total service
      prisma.service.count(),
    ]);

  const completedBookings = await prisma.booking.findMany({
    where: { status: "COMPLETED" },
    select: {
      service: {
        select: { price: true },
      },
    },
  });

  const totalRevenue = completedBookings.reduce(
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

const getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllBookingsFromDB = async () => {
  return await prisma.booking.findMany({
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      service: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createCategoryInDB = async (payload: {
  name: string;
  description?: string;
}) => {
  const isExist = await prisma.category.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (isExist) {
    throw new Error("Category already exists!");
  }

  const slug = payload.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return await prisma.category.create({
    data: {
      name: payload.name,
      slug,
      description: payload.description || "",
    },
  });
};

const getAllCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

// change user status (ACTIVE/BANNED)
const updateUserStatusInDB = async (
  adminId: string,
  id: string,
  status: UserStatus,
) => {
  if (adminId === id) {
    throw new Error("You cannot change your own status!");
  }

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

// change user role (CUSTOMER/TECHNICIAN/ADMIN)
const updateUserRoleInDB = async (
  adminId: string,
  id: string,
  role: UserRole,
) => {
  if (adminId === id) {
    throw new Error("You cannot change your own role!");
  }

  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new Error("User not found!");
  }

  if (isUserExist.status === UserStatus.BANNED) {
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
  getAllUsersFromDB,
  getAllBookingsFromDB,
  createCategoryInDB,
  getAllCategoriesFromDB,
};
