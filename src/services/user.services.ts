import { UserEmailUserException } from "@/errors/user-email-used.exception";
import { User } from "../interfaces/user.interface";
import { prisma } from "../libs/prisma";
import { crypted } from "../utils/crypto";
import { InvalidCredentialsException } from "@/errors/invalid-credentials.exception";

export class UsersService {
  constructor() {}
  async createUser(user: User) {
    if (await this.findUserByEmail(user.email)) {
      throw new UserEmailUserException();
    }
    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: await crypted(user.password),
        isActive: true,
      },
    });
    return newUser;
  }

  async findUsers() {
    const users = await prisma.user.findMany();
    return users;
  }

  async findUserById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new InvalidCredentialsException();
    return user;
  }
}
