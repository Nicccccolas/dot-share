import { Router } from "express";
import { UsersController } from "../controllers/users.controllers";
import auth from "@/middlewares/authorization.middleware";

const userController = new UsersController();

const router: Router = Router();

router.get("/", auth("getUsers"), userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", auth(), userController.patchUser);
router.patch("/desactivate/:id", auth(), userController.desactiveUser);

export { router };
