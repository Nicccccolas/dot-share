import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import { Tokens, TokenType } from "@prisma/client";
import { prisma } from "../libs/prisma";
import "dotenv/config";
import { AuthTokenResponse } from "../interfaces/tokens.interface";

const jwtSecret: string = process.env.JWT_SECRET as string;
const accessExpirationMinutes = process.env.JWT_ACCESS_EXPIRATION_MINUTES;

if (!jwtSecret || !accessExpirationMinutes) {
  throw new Error(
    "Missing JWT_SECRET or JWT_ACCESS_EXPIRATION_MINUTES in environment variables",
  );
}

export class TokenServices {
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
  ): Promise<Tokens> => {
    const createdToken = await prisma.tokens.create({
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

  verifyToken = async (token: string, type: TokenType): Promise<Tokens> => {
    const payload = jwt.verify(token, jwtSecret);
    const userId: string = payload.sub as string;
    const tokenData = await prisma.tokens.findFirst({
      where: {
        userId: userId,
        token,
        type,
        blacklisted: false,
      },
    });
    if (!tokenData) {
      throw new Error("TOKEN_NOT_FOUND");
    }
    return tokenData;
  };

  generateAuthToken = async (user: {
    id: string;
  }): Promise<AuthTokenResponse> => {
    console.log("USER: ", user.id);
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
