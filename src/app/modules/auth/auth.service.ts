import bcryptjs from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../../config";
import { prisma } from "../../../lib/prisma";

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error("User does not exist with this email address!");
  }

  // account check
  if (user.status === "BANNED") {
    throw new Error("This account has been banned by an administrator!");
  }

  // pass check
  const isPasswordMatched = await bcryptjs.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new Error("Incorrect password! Please try again.");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // JWT generator
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expiration as SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expiration as SignOptions["expiresIn"] },
  );

  const responseUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: responseUser,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUser,
};