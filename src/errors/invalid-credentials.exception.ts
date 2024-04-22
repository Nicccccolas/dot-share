import { HttpStatus } from "@/enums/https-status.enum";

export class InvalidCredentialsException extends Error {
  public statusCode;

  constructor() {
    super("Invalid credentials");
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}
