import prisma from "@/config/prisma";
import { crypted } from "@/utils/crypto";
import ErrorApi from "@/utils/errorApi";
import { HttpStatus } from "@/enums/https-status.enum";
import { Prisma, User } from "@prisma/client";

export class UsersService {
  constructor() {}
  async createUser(user: User) {
    if (!user.username || !user.email || !user.password) {
      throw new ErrorApi(HttpStatus.BAD_REQUEST, "All fields are required");
    }

    if (await this.findUserByEmail(user.email)) {
      throw new ErrorApi(HttpStatus.BAD_REQUEST, "Email already taken");
    }
    if (await this.findUserByUsername(user.username)) {
      throw new ErrorApi(HttpStatus.BAD_REQUEST, "Username already taken");
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
        email,
      },
    });
    return user;
  }

  async findUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new ErrorApi(HttpStatus.BAD_REQUEST, "User not found");
    }
    if (data.email && (await this.findUserByEmail(data.email as string))) {
      throw new ErrorApi(HttpStatus.BAD_REQUEST, "Email already taken");
    }

    if (
      data.username &&
      (await this.findUserByUsername(data.username as string))
    ) {
      throw new ErrorApi(HttpStatus.BAD_REQUEST, "Username already taken");
    }
    const userUpdated = await prisma.user.update({
      where: { id: user.id },
      data: data,
    });
    await prisma.user.update({
      where: {
        id,
      },
      data: data,
    });
    return userUpdated;
  }
}
