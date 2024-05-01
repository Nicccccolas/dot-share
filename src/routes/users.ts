import { Router } from "express";
import { UsersController } from "../controllers/users.controllers";
import auth from "@/middlewares/authorization.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { userValidation } from "@/validations";

const userController = new UsersController();

const router: Router = Router();

router.get("/", auth("getUsers"), userController.getUsers);
router.get(
  "/:id",
  validate(userValidation.getUser),
  userController.getUserById,
);
router.patch(
  "/:id",
  validate(userValidation.patchUser),
  auth(),
  userController.patchUser,
);
router.patch(
  "/desactivate/:id",
  validate(userValidation.desactivateUser),
  auth(),
  userController.desactiveUser,
);

export { router };
