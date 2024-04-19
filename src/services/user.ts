import { User } from "../interfaces/user.interface";
import { prisma } from "../libs/prisma";

export class UserService {
  async createUser(user: User) {
    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        isActive: true,
      },
    });
    return newUser;
  }

  async findUserByEmail(email: string) {
    await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
