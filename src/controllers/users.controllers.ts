import { Request, Response } from "express";
import { throwError } from "@/utils/error.handlers";
import { UsersService } from "@/services/user.services";

const userService = new UsersService();

export class UsersController {
  constructor() {}

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.findUsers();
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

  async patchUser(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    try {
      const userUpdated = await userService.updateUser(id, data);
      res.status(200).json(userUpdated);
    } catch (error) {
      throwError(res, error);
    }
  }

  async desactiveUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await userService.desactivateUser(id);
      res.status(200).json({ message: "Account desactivate succesfully" });
    } catch (error) {
      throwError(res, error);
    }
  }
}
