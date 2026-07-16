import { Request, Response } from "express";
import httpStatus from "http-status";
import { ServiceService } from "./service.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

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
  const filters = {
    searchTerm: req.query.searchTerm as string,
    categoryId: req.query.categoryId as string,
    minPrice: req.query.minPrice as string,
    maxPrice: req.query.maxPrice as string,
    location: req.query.location as string,
  };

  // Safely parse pagination boundaries before applying defaults
  const requestedPage =
    req.query.page !== undefined ? Number(req.query.page) : undefined;
  const limit = Number(req.query.limit) || 10;

  if (requestedPage !== undefined && requestedPage <= 0) {
    return res.status(httpStatus.OK).json({
      success: true,
      message: "Invalid page number. Page must be 1 or greater.",
      meta: {
        page: requestedPage,
        limit: limit,
        total: 0,
        totalPage: 0,
      },
      data: [],
    });
  }

  const paginationOptions = {
    page: requestedPage || 1,
    limit: limit,
    sortBy: (req.query.sortBy as string) || "id",
    sortOrder: (req.query.sortOrder as string) || "desc",
  };

  const result = await ServiceService.getAllServicesFromDB(
    filters,
    paginationOptions,
  );

  const responseMessage =
    (result as any).message || "Services fetched successfully!";

  res.status(httpStatus.OK).json({
    success: true,
    message: responseMessage,
    meta: result.meta,
    data: result.data,
  });
});

const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ServiceService.getSingleServiceFromDB(id);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Service not found!",
      data: null,
    });
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Service fetched successfully!",
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;

  await ServiceService.deleteServiceFromDB(id, userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Service deleted successfully!",
    data: null,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceService.updateServiceIntoDB(
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully!",
    data: result,
  });
});

export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
  deleteService,
  updateService,
};
