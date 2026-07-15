import { Request, Response } from "express";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategoryInDB(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategoriesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories fetched successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategoryFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category deleted successfully!",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getSingleCategoryFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category fetched successfully!",
    data: result,
  });
});


const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategoryInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully!",
    data: result,
  });
});


export const CategoryController = {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getSingleCategory
};
