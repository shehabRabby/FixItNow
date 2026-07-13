import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/create-category",
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

export const CategoryRoutes = router;