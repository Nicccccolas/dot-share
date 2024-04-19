import { Router } from "express";
import { UsersController } from "../controllers/users.controllers";

const userController = new UsersController();

const router: Router = Router();

router.get("/", userController.getUsers);
router.post("/", userController.postUser);

export { router };
