import { prisma } from "../../../lib/prisma";

const formatSlotsToArray = (
  slotsString: string | null | undefined,
): string[] => {
  if (!slotsString) return [];
  return slotsString.split(", ").filter(Boolean);
};

const getTechnicianProfileFromDB = async (userId: string) => {
  let result = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true, status: true },
      },
    },
  });

  if (!result) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (userExists && userExists.role === "TECHNICIAN") {
      result = await prisma.technicianProfile.create({
        data: {
          userId,
          skills: "",
          experienceYears: 0,
          bio: "",
          availabilitySlots: "",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });
    } else {
      throw new Error("Technician profile not found!");
    }
  }

  return {
    ...result,
    availabilitySlots: formatSlotsToArray(result.availabilitySlots),
  };
};

const updateTechnicianProfileInDB = async (userId: string, payload: any) => {
  const updateData: any = {};

  if (payload.skills !== undefined) {
    updateData.skills = Array.isArray(payload.skills)
      ? payload.skills.join(", ")
      : payload.skills;
  }

  if (payload.experienceYears !== undefined) {
    updateData.experienceYears = payload.experienceYears;
  }

  if (payload.bio !== undefined) {
    updateData.bio = payload.bio;
  }

  if (payload.availabilitySlots !== undefined) {
    updateData.availabilitySlots = Array.isArray(payload.availabilitySlots)
      ? payload.availabilitySlots.join(", ")
      : payload.availabilitySlots;
  }

  const result = await prisma.technicianProfile.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      skills: updateData.skills || "",
      experienceYears: updateData.experienceYears || 0,
      bio: updateData.bio || "",
      availabilitySlots: updateData.availabilitySlots || "",
    },
  });

  return {
    ...result,
    availabilitySlots: formatSlotsToArray(result.availabilitySlots),
  };
};

const updateAvailabilitySlotsInDB = async (
  userId: string,
  slotsArray: string[],
) => {
  const serializedSlots = slotsArray.join(", ");

  const result = await prisma.technicianProfile.upsert({
    where: { userId },
    update: {
      availabilitySlots: serializedSlots,
    },
    create: {
      userId,
      skills: "",
      experienceYears: 0,
      bio: "",
      availabilitySlots: serializedSlots,
    },
  });

  return {
    ...result,
    availabilitySlots: formatSlotsToArray(result.availabilitySlots),
  };
};

export const TechnicianService = {
  getTechnicianProfileFromDB,
  updateTechnicianProfileInDB,
  updateAvailabilitySlotsInDB,
};
