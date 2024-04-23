import { Router } from "express";
import { AuthController } from "@/auth/auth.controllers";

const authController = new AuthController();

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-tokens", authController.refreshTokens);
router.post("/forgot-password", authController.forgotPassword);

export { router };
