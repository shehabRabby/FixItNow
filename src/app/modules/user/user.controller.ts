import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserIntoDB(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

export const UserController = {
  createUser,
};