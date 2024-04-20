import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handlers";
import { UsersService } from "../services/user.services";
import { TokenServices } from "../services/token.services";
import exclude from "../utils/exclude";

const userService = new UsersService();
const tokenService = new TokenServices();

export class AuthController {
  constructor() {}

  async register(req: Request, res: Response) {
    const user = req.body;
    try {
      const newUser = await userService.createUser(user);
      const userWithoutPassword = exclude(newUser, [
        "password",
        "created_at",
        "updated_at",
      ]);
      const tokens = await tokenService.generateAuthToken(newUser);
      res.status(201).json({ user: userWithoutPassword, tokens });
    } catch (error) {
      handleHttp(res, "ERROR_REGISTER_USER", error);
    }
  }
}
