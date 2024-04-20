import { Router } from "express";
import { CategoriesController } from "@/controllers/categories.controller";

const categoriesController = new CategoriesController();
const router = Router();

router.get("/", categoriesController.getCategories);
router.get("/:id", categoriesController.getCategoryById);
router.post("/", categoriesController.createCategory);

export { router };
