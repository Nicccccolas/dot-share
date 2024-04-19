import { Request, Response } from "express";

export class CategoriesController {
  async getCategories(_: Request, res: Response) {
    return res.json({
      message: 'world'
    })
  }
}
