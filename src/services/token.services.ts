import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import { Token, TokenType } from "@prisma/client";
import prisma from "@/config/prisma";
import config from "@/config/config";
import { UsersService } from "./user.services";
import { AuthTokenResponse } from "../interfaces/tokens.interface";
import { NotFoundException } from "@/errors/not_found.exception";

const userService = new UsersService();

export class TokensServices {
  generateToken = (
    id: string,
    expires: Moment,
    type: TokenType,
    secret: string = config.jwt.secret,
  ): string => {
    const payload = {
      sub: id,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };

  saveToken = async (
    id: string,
    token: string,
    expires: Moment,
    type: TokenType,
    blacklisted = false,
  ): Promise<Token> => {
    const createdToken = await prisma.token.create({
      data: {
        userId: id,
        token,
        expires: expires.toDate(),
        type,
        blacklisted,
      },
    });
    return createdToken;
  };

  verifyToken = async (token: string, type: TokenType): Promise<Token> => {
    const payload = jwt.verify(token, config.jwt.secret);
    const userId: string = payload.sub as string;
    const tokenData = await prisma.token.findFirst({
      where: {
        userId: userId,
        token,
        type,
        blacklisted: false,
      },
    });
    if (!tokenData) {
      throw new NotFoundException();
    }
    return tokenData;
  };

  generateAuthTokens = async (user: {
    id: string;
  }): Promise<AuthTokenResponse> => {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes",
    );
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      TokenType.ACCESS,
    );

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days",
    );
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      TokenType.REFRESH,
    );
    await this.saveToken(
      user.id,
      refreshToken,
      refreshTokenExpires,
      TokenType.REFRESH,
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  };

  async generateResetPasswordToken(email: string) {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    const expires = moment().add(
      config.jwt.resetPasswordExpirationMinutes,
      "minutes",
    );
    const resetPasswordToken = this.generateToken(
      user.id,
      expires,
      TokenType.RESET_PASSWORD,
    );
    await this.saveToken(
      user.id,
      resetPasswordToken,
      expires,
      TokenType.RESET_PASSWORD,
    );
    return resetPasswordToken;
  }
}
