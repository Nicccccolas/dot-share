import { UserEmailUserException } from "@/errors/user-email-used.exception";
import { Users } from "../interfaces/users.interface";
import { prisma } from "../libs/prisma";
import { crypted } from "../utils/crypto";
import { InvalidCredentialsException } from "@/errors/invalid-credentials.exception";

export class UsersService {
  async createUser(user: Users) {
    if (await this.findUserByEmail(user.email)) {
      throw new UserEmailUserException();
    }
    const newUser = await prisma.users.create({
      data: {
        username: user.username,
        email: user.email,
        password: await crypted(user.password),
        is_active: true,
      },
    });
    return newUser;
  }

  async findUsers() {
    const users = await prisma.users.findMany();
    return users;
  }

  async findUserById(id: string) {
    const user = await prisma.users.findUnique({ where: { id } });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new InvalidCredentialsException();
    return user;
  }
}
