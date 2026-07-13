import { Request, Response } from "express";
import httpStatus from "http-status";
import { ProfileService } from "./profile.service";
import catchAsync from "../../utils/catchAsync";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await ProfileService.getMyProfileFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Profile retrieved successfully!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const updateBody = req.body;

  const result = await ProfileService.updateMyProfileInDB(userId, updateBody);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});

export const ProfileController = {
  getMyProfile,
  updateMyProfile,
};