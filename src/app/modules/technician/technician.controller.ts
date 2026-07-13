import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { TechnicianService } from "./technician.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await TechnicianService.getTechnicianProfileFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Technician profile fetched successfully!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const updateData = { ...req.body };

  const result = await TechnicianService.updateTechnicianProfileInDB(
    userId,
    updateData,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Technician profile updated successfully!",
    data: result,
  });
});

export const TechnicianController = {
  getMyProfile,
  updateMyProfile,
};
