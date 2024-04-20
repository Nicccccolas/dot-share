import { Request, Response } from "express";
import { throwError } from "@/utils/error.handlers";
import { CategoriesService } from "@/services/categories.service";
import { Category } from "@/models/category.model";

const categoriesService = new CategoriesService();

export class CategoriesController {
  public async getCategoryById(req: Request, res: Response) {
    const params = req.params;

    try {
      const category = await categoriesService.getCategoryById({ categoryId: params?.id });
      res.json(category).status(200);
    } catch (error: any) {
      throwError(res, error);
    }
  }

  public async getCategories(_: Request, res: Response) {
    try {
      res.json({
        data: await categoriesService.getCategories()
      });
    } catch (error: any) {
      throwError(res, error);
    }
  }

  public async createCategory(req: Request, res: Response) {
    const data: Category = req.body;

    try {
      res.json({
        data: await categoriesService.createCategory({ data })
      }).status(201);
    } catch (error: any) {
      throwError(res, error);
    }
  }
}
