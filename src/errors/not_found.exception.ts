import { HttpStatus } from "@/enums/https-status.enum";

export class NotFoundException extends Error {
  public statusCode;

  constructor() {
    super("Not found");
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
