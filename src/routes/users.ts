import { Router, Request, Response } from "express";
import { UserController } from "../controllers/user";

const userController = new UserController();
const router: Router = Router();

router.get("/", userController.getUsers);
router.post("/", userController.postUser);

export { router };
