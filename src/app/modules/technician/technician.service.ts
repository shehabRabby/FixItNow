import { prisma } from "../../../lib/prisma";

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
      await prisma.technicianProfile.create({
        data: {
          userId,
          skills: "",
          experienceYears: 0,
          bio: "",
          availabilitySlots: "",
        },
      });

      result = await prisma.technicianProfile.findUnique({
        where: { userId },
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

  return result;
};

const updateTechnicianProfileInDB = async (userId: string, payload: any) => {
  const formattedSkills = Array.isArray(payload.skills)
    ? payload.skills.join(", ")
    : payload.skills;

  const result = await prisma.technicianProfile.upsert({
    where: { userId },
    update: {
      skills: formattedSkills ?? payload.skills,
      experienceYears: payload.experienceYears,
      bio: payload.bio,
      availabilitySlots: payload.availabilitySlots,
    },
    create: {
      userId,
      skills: formattedSkills || "",
      experienceYears: payload.experienceYears || 0,
      bio: payload.bio || "",
      availabilitySlots: payload.availabilitySlots || "",
    },
  });

  return result;
};

export const TechnicianService = {
  getTechnicianProfileFromDB,
  updateTechnicianProfileInDB,
};
