import bcryptjs from "bcryptjs";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";

const createUserIntoDB = async (payload: any) => {
  // Email uniqueness check
  const isUserExists = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExists) {
    throw new Error("This email is already registered!");
  }

  // Hash password processing
  const rounds = parseInt((config.bcrypt_salt_rounds as string) || "12", 10);
  const hashedPassword = await bcryptjs.hash(payload.password, rounds);

  // Save into database using Transaction to ensure sync
  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
      },
    });

    // Automatically initialize profile if role is TECHNICIAN
    if (payload.role === "TECHNICIAN") {
      await tx.technicianProfile.create({
        data: {
          userId: newUser.id,
          skills: "",
          experienceYears: 0, 
          bio: "",
          availabilitySlots: "", 
        },
      });
    }

    return newUser;
  });

  // Safe object formatting for client response
  const responseData = {
    id: result.id,
    name: result.name,
    email: result.email,
    role: result.role,
    status: result.status,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };

  return responseData;
};

export const UserService = {
  createUserIntoDB,
};
