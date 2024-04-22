import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import { Token, TokenType } from "@prisma/client";
import { prisma } from "../libs/prisma";
import "dotenv/config";
import { AuthTokenResponse } from "../interfaces/tokens.interface";
import { NotFoundException } from "@/errors/not_found.exception";

const jwtSecret: string = process.env.JWT_SECRET as string;
const accessExpirationMinutes = process.env.JWT_ACCESS_EXPIRATION_MINUTES;

export class TokensServices {
  generateToken = (
    id: string,
    expires: Moment,
    type: TokenType,
    secret: string = jwtSecret,
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
    const payload = jwt.verify(token, jwtSecret);
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
    const accessTokenExpires = moment().add(accessExpirationMinutes, "minutes");
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      TokenType.ACCESS,
    );

    const refreshTokenExpires = moment().add(
      process.env.JWT_ACCESS_EXPIRATION_DAYS,
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
}
