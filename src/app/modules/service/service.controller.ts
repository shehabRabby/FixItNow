import { Request, Response } from "express";
import httpStatus from "http-status";

import { ServiceService } from "./service.service";
import catchAsync from "../../utils/catchAsync";

const createService = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const serviceBody = req.body;

  const result = await ServiceService.createServiceInDB(userId, serviceBody);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Service created successfully!",
    data: result,
  });
});

export const ServiceController = {
  createService,
};
