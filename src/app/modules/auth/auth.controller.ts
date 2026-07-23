import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "User logged in successfully!",
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    data: req.user,
  });
});

export const AuthController = {
  loginUser,
  getMyProfile,
};
