import { TokenType, User } from "@prisma/client";
import { UsersService } from "@/services/user.services";
import { compare } from "bcrypt";
import { InvalidCredentialsException } from "@/errors/invalid-credentials.exception";
import prisma from "@/config/prisma";
import { NotFoundException } from "@/errors/not_found.exception";
import { TokensServices } from "@/services/token.services";

const userService = new UsersService();
const tokensService = new TokensServices();
export class AuthService {
  constructor() {}

  async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await userService.findUserByEmail(email);
    const hashPassword = user.password;
    if (!user || !(await compare(password, hashPassword))) {
      throw new InvalidCredentialsException();
    }
    return user;
  }

  async logout(refreshToken: string) {
    const refreshTokenData = await prisma.token.findFirst({
      where: {
        token: refreshToken,
        type: TokenType.REFRESH,
        blacklisted: false,
      },
    });
    if (!refreshTokenData) {
      throw new NotFoundException();
    }
    await prisma.token.delete({
      where: {
        id: refreshTokenData.id,
      },
    });
  }

  async refreshAuth(refreshToken: string) {
    try {
      const refreshTokenData = await tokensService.verifyToken(
        refreshToken,
        TokenType.REFRESH,
      );
      const { userId } = refreshTokenData;
      await prisma.token.delete({ where: { id: refreshTokenData.id } });
      return tokensService.generateAuthTokens({ id: userId });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
