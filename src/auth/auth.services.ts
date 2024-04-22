import { Users } from "@prisma/client";
import { UsersService } from "@/services/user.services";
import { compare } from "bcrypt";
import { InvalidCredentialsException } from "@/errors/invalid-credentials.exception";

const userService = new UsersService();

export class AuthService {
  constructor() {}

  async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Users> {
    const user = await userService.findUserByEmail(email);
    const hashPassword = user.password;
    if (!user || !(await compare(password, hashPassword))) {
      throw new InvalidCredentialsException();
    }
    return user;
  }
}
