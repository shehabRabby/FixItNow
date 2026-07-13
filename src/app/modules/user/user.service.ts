import bcryptjs from "bcryptjs";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";

const createUserIntoDB = async (payload: any) => {
  const isUserExists = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExists) {
    throw new Error("This email is already registered!");
  }

  // Hash password
  const rounds = parseInt((config.bcrypt_salt_rounds as string) || "10", 10);
  const hashedPassword = await bcryptjs.hash(payload.password, rounds);

  // Save model context into database
  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

export const UserService = {
  createUserIntoDB,
};
