import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifyCallback,
} from "passport-jwt";
import config from "@/config/config";
import { TokenType } from "@prisma/client";
import prisma from "@/config/prisma";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: config.jwt.secret,
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type != TokenType.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
      },
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(options, jwtVerify);
