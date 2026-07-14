import { Request, Response } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import catchAsync from "../../utils/catchAsync";
import { UserRole, UserStatus } from "../../../../generated/prisma/client";

const getDashboardOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardOverviewFromDB();

  res.status(httpStatus.OK).json({
    success: true,
    message: "Dashboard overview data retrieved successfully!",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const status = req.body.status as UserStatus;
  const result = await AdminService.updateUserStatusInDB(id, status);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User status updated successfully!",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const role = req.body.role as UserRole;
  const result = await AdminService.updateUserRoleInDB(id, role);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User role updated successfully!",
    data: result,
  });
});
export const AdminController = {
  getDashboardOverview,
  updateUserStatus,
  updateUserRole,
};
