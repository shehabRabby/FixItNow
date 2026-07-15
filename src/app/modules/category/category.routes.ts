import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-category",
  auth("ADMIN"),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory,
);

router.delete("/:id", auth("ADMIN"), CategoryController.deleteCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getSingleCategory);
router.patch("/:id", auth("ADMIN"), CategoryController.updateCategory);

export const CategoryRoutes = router;
