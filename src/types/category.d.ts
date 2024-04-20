import { Category } from "@/models/category.model";

export interface CreateCategoryParams {
  data: Category
}

export interface GetCategoryByIdParams {
  categoryId: string
}
