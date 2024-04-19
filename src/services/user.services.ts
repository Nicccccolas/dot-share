import { Users } from "../interfaces/users.interface";
import { prisma } from "../libs/prisma";

export class UsersService {
  async createUser(user: Users) {
    const newUser = await prisma.users.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        is_active: true,
      },
    });
    return newUser;
  }

  async findUserByEmail(email: string) {
    await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }
}
