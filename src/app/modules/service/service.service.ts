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

const getAllServicesFromDB = async () => {
  const result = await prisma.service.findMany({
    include: {
      category: true,
      technicianProfile: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });
  return result;
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

const deleteServiceFromDB = async (id: string) => {
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
