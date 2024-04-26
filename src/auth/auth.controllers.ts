import { Request, Response } from "express";
import { throwError } from "@/utils/error.handlers";
import { UsersService } from "@/services/user.services";
import { TokensService } from "@/services/token.services";
import { AuthService } from "./auth.services";
import exclude from "@/utils/exclude";
import { MailService } from "@/config/transport";

const userService = new UsersService();
const authService = new AuthService();
const tokenService = new TokensService();
const mailService = new MailService();

export class AuthController {
  constructor() {}

  async register(req: Request, res: Response) {
    const data = req.body;
    try {
      const newUser = await userService.createUser(data);
      const userWithoutPassword = exclude(newUser, [
        "isActive",
        "password",
        "createdAt",
        "updatedAt",
      ]);
      const tokens = await tokenService.generateAuthTokens(newUser);
      res.status(201).json({ user: userWithoutPassword, tokens });
    } catch (error) {
      throwError(res, error);
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await authService.loginWithEmailAndPassword(email, password);
      const tokens = await tokenService.generateAuthTokens(user);
      res.status(200).json({ user, tokens });
    } catch (error) {
      throwError(res, error);
    }
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    try {
      await authService.logout(refreshToken);
      res.status(204).send();
    } catch (error) {
      throwError(res, error);
    }
  }

  async refreshTokens(req: Request, res: Response) {
    const { refreshToken } = req.body;
    try {
      const tokens = await authService.refreshAuth(refreshToken);
      res.send({ ...tokens });
    } catch (error) {
      throwError(res, error);
    }
  }
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const resetPassswordToken =
        await tokenService.generateResetPasswordToken(email);

      await mailService.sendResetPasswordEmail(email, resetPassswordToken);
      res.status(200).json({ message: "Email sended!" });
    } catch (error) {
      throwError(res, error);
    }
  }

  async resetPassword(req: Request, res: Response) {
    const resetPasswordToken: string = req.query.token as string;
    const { newPassword } = req.body;

    try {
      await authService.resetPassword(resetPasswordToken, newPassword);
      res.status(204).json({ message: "Password changed" });
    } catch (error) {
      throwError(res, error);
    }
  }
}
