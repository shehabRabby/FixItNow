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

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getAllServicesFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Services fetched successfully!",
    data: result,
  });
});

const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ServiceService.getSingleServiceFromDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Service fetched successfully!",
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await ServiceService.deleteServiceFromDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Service deleted successfully!",
    data: null,
  });
});


export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
  deleteService,
};
