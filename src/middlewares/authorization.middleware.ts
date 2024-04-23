import passport from "passport";
import { User } from "@prisma/client";
import { roleRights } from "../utils/roles";
import { Request, Response, NextFunction } from "express";
import ErrorApi from "@/utils/errorApi";
import { HttpStatus } from "@/enums/https-status.enum";

/* eslint-disable */
const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[],
  ) =>
  async (err: unknown, user: User | false, info: unknown) => {
    if (err || info || !user) {
      return reject(
        new ErrorApi(HttpStatus.UNAUTHORIZED, "Please authenticate"),
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight),
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new Error("Forbidden"));
      }
    }
    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights),
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
