import { HttpStatus } from "@/enums/https-status.enum";

export class UserEmailUserException extends Error {
  public statusCode;

  constructor() {
    super("Email already taken");
    this.statusCode = HttpStatus.NOT_ACCEPTABLE;
  }
}
