import { Router } from "express";
import { UsersController } from "../controllers/users.controllers";
import auth from "@/middlewares/authorization.middleware";

const userController = new UsersController();

const router: Router = Router();

router.get("/", auth(), userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/sign-in", userController.postUser);

export { router };
