import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handlers";
import { UserService } from "../services/user";

const userService = new UserService();

export class UserController {
  constructor() {}
  async getUser(req: Request, res: Response) {
    try {
    } catch (error) {
      handleHttp(res, "ERROR_GET_USER");
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
    } catch (error) {
      handleHttp(res, "ERROR_GET_USERS");
    }
  }

  async postUser(req: Request, res: Response) {
    const user = req.body;
    try {
      const newUser = await userService.createUser(user);
      return res.status(201).json(newUser);
    } catch (error) {
      handleHttp(res, "ERROR_CREATE_USER", error);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
    } catch (error) {
      handleHttp(res, "ERROR_UPDATE_USER");
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
    } catch (error) {
      handleHttp(res, "ERROR_DELETE_USER");
    }
  }
}
