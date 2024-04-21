import { HttpStatus } from "@/enums/https-status.enum";

export class UserNotFoundException extends Error {
  public statusCode;

  constructor() {
    super("The user was not found");
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
