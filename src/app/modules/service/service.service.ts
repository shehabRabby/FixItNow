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

export const ServiceService = {
  createServiceInDB,
};
