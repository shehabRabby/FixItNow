import { Request, Response } from "express";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";
import catchAsync from "../../utils/catchAsync";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategoryInDB(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

export const CategoryController = { createCategory };