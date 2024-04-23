import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifyCallback,
} from "passport-jwt";
import config from "@/config/config";
import { UsersService } from "@/services/user.services";

const userService = new UsersService();

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: config.jwt.secret,
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  userService.findUserById(payload.sub).then((user) => {
    if (user) {
      done(null, payload);
    } else {
      done(null, false);
    }
  });
};

export const jwtStrategy = new JwtStrategy(options, jwtVerify);
