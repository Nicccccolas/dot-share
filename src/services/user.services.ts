import { Users } from "../interfaces/users.interface";
import { prisma } from "../libs/prisma";
import { crypted } from "../utils/crypto";

export class UsersService {
  async createUser(user: Users) {
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
    const user = await prisma.users.findUnique({ where: { id: 2 } });
    return user;
  }

  async findUserByEmail(email: string) {
    await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }
}
