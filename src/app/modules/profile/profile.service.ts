import { prisma } from "../../../lib/prisma";

const getMyProfileFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      technicianProfile: true,
    },
  });

  if (!result) {
    throw new Error("User profile not found!");
  }
  const profileData = result as Record<string, any>;
  delete profileData.password;

  return profileData;
};

const updateMyProfileInDB = async (userId: string, payload: Partial<any>) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  const { skills, experienceYears, bio, availabilitySlots, ...userData } =
    payload;

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userData,
    });

    if (
      user.role === "TECHNICIAN" &&
      (skills || experienceYears || bio || availabilitySlots)
    ) {
      await tx.technicianProfile.update({
        where: { userId: userId },
        data: {
          skills,
          experienceYears: experienceYears
            ? Number(experienceYears)
            : undefined,
          bio,
          availabilitySlots,
        },
      });
    }

    return await tx.user.findUnique({
      where: { id: userId },
      include: {
        technicianProfile: true,
      },
    });
  });

  const updatedData = result as Record<string, any>;
  delete updatedData.password;
  return updatedData;
};

export const ProfileService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
};
