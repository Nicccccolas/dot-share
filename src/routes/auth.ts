import { Router } from "express";
import { AuthController } from "../auth/auth.controllers";

const authController = new AuthController();

const router: Router = Router();

router.post("/register", authController.register);

router.post("/login");

export { router };
