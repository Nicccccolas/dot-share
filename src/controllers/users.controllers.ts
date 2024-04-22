import { Request, Response } from "express";
import { throwError } from "../utils/error.handlers";
import { UsersService } from "../services/user.services";

const userService = new UsersService();

export class UsersController {
  constructor() {}

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.findUsers();
      console.log("UsersController: ", users);
      return res.status(200).json(users);
    } catch (error) {
      throwError(res, error);
    }
  }

  async getUserById({ params }: Request, res: Response) {
    const { id } = params;
    try {
      const user = await userService.findUserById(id);
      const data = user ? user : "NOT_FOUND";
      return res.status(200).json(data);
    } catch (error) {
      throwError(res, error);
    }
  }

  async postUser(req: Request, res: Response) {
    const user = req.body;
    try {
      const newUser = await userService.createUser(user);
      return res.status(201).json(newUser);
    } catch (error) {
      throwError(res, error);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
    } catch (error) {
      throwError(res, error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
    } catch (error) {
      throwError(res, error);
    }
  }
}
