import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

const createServiceInDB = async (userId: string, serviceData: any) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error(
      "Technician profile not found. Please create a profile first!",
    );
  }

  const result = await prisma.service.create({
    data: {
      ...serviceData,
      technicianProfileId: technicianProfile.id,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const getAllServicesFromDB = async (
  filters: {
    searchTerm?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    location?: string;
  },
  paginationOptions: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: string;
  },
) => {
  const { searchTerm, categoryId, minPrice, maxPrice, location } = filters;
  const { page, limit, sortBy, sortOrder } = paginationOptions;

  if (page < 1) {
    return {
      meta: {
        page,
        limit,
        total: 0,
        totalPage: 0,
      },
      data: [],
      message: "Invalid page number. Page must be 1 or greater.", // কাস্টম মেসেজ
    };
  }

  // Calculate pagination parameters
  const skip = (page - 1) * limit;

  //  Build explicit Type-Safe conditions array
  const andConditions: Prisma.ServiceWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (location) {
    andConditions.push({
      location: { contains: location, mode: "insensitive" },
    });
  }

  if (minPrice || maxPrice) {
    const priceCondition: Prisma.IntFilter = {};
    if (minPrice) priceCondition.gte = Number(minPrice);
    if (maxPrice) priceCondition.lte = Number(maxPrice);
    andConditions.push({ price: priceCondition });
  }

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Sorting Guard & Type Casting
  const allowedSortFields = ["id", "title", "price", "location"];
  const finalSortBy = allowedSortFields.includes(sortBy || "")
    ? (sortBy as string)
    : "id";

  const finalSortOrder =
    sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc";

  // 4. Get total count first to validate extra empty pages
  const total = await prisma.service.count({
    where: whereConditions,
  });

  const totalPage = Math.ceil(total / limit);

  // check page number validity against total pages
  if (total > 0 && page > totalPage) {
    return {
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
      data: [],
      message: "No data found. You have reached beyond the available pages.", // খালি পেজের মেসেজ
    };
  }

  // 5. Query Database if page numbers are valid
  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [finalSortBy]: finalSortOrder,
    },
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getSingleServiceFromDB = async (id: string) => {
  const result = await prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
      technicianProfile: true,
    },
  });
  return result;
};

const deleteServiceFromDB = async (id: string, userId: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { technicianProfile: true },
  });

  if (!service) {
    throw new Error("Service not found!");
  }

  if (service.technicianProfile.userId !== userId) {
    throw new Error(
      "Forbidden! You can only delete your own created services.",
    );
  }

  const result = await prisma.service.delete({
    where: { id },
  });

  return result;
};
export const ServiceService = {
  createServiceInDB,
  getAllServicesFromDB,
  getSingleServiceFromDB,
  deleteServiceFromDB,
};
