import { TokenType, User } from "@prisma/client";
import { UsersService } from "@/services/user.services";
import prisma from "@/config/prisma";
import { TokensService } from "@/services/token.services";
import ErrorApi from "@/utils/errorApi";
import { HttpStatus } from "@/enums/https-status.enum";
import { crypted, compare } from "@/utils/crypto";

const userService = new UsersService();
const tokensService = new TokensService();

export class AuthService {
  constructor() {}

  async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    if (!email || !password) {
      throw new ErrorApi(HttpStatus.BAD_REQUEST, "All fields are required");
    }
    const user = await userService.findUserByEmail(email);
    const hashedPassword = user?.password as string;
    if (!user || !(await compare(password, hashedPassword))) {
      throw new ErrorApi(HttpStatus.UNAUTHORIZED, "Invalid credentials");
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
    if (!refreshTokenData || !refreshToken) {
      throw new ErrorApi(HttpStatus.NOT_FOUND, "Refresh token not found");
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
      throw new ErrorApi(HttpStatus.UNAUTHORIZED, "Please authenticate");
    }
  }

  async resetPassword(resetPasswordToken: string, newPassword: string) {
    try {
      const tokenData = await tokensService.verifyToken(
        resetPasswordToken,
        TokenType.RESET_PASSWORD,
      );

      const user = await userService.findUserById(tokenData.userId);
      const hashPassword = await crypted(newPassword);

      await userService.updateUser(tokenData.userId, {
        password: hashPassword,
      });
      await prisma.token.deleteMany({
        where: { userId: user?.id, type: TokenType.RESET_PASSWORD },
      });
    } catch (error) {
      throw new ErrorApi(HttpStatus.UNAUTHORIZED, "Password reset failed!");
    }
  }
}
