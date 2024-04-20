import { Category } from "@/models/category.model";
import { prisma } from "../libs/prisma";
import { CreateCategoryParams, GetCategoryByIdParams } from "@/types/category";
import { CategoryNotFoundException } from "@/errors/category-not-found.exception";

export class CategoriesService {
  public async getCategories(): Promise<Category[]> {
    return await prisma.category.findMany();
  }

  public async getCategoryById(fields: GetCategoryByIdParams): Promise<Category> {
    const categoryFounded = await prisma.category.findUnique({
      where: {
        id: fields.categoryId
      }
    });

    if (!categoryFounded) throw new CategoryNotFoundException();

    return categoryFounded;
  }

  public async createCategory(fields: CreateCategoryParams): Promise<Category> {
    const newCategory = await prisma.category.create({
      data: {
        name: fields.data.name,
        description: fields.data.description
      }
    });

    console.log({ create: newCategory });

    return newCategory;
  }
}
