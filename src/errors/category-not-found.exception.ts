import { HttpStatus } from "@/enums/https-status.enum";

export class CategoryNotFoundException extends Error {
  public statusCode;

  constructor() {
    super("La categoría no fue encontrada");
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
