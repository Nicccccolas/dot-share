import { PostsController } from "@/controllers/posts.controller";
import { Router } from "express";

const router = Router();
const postsController = new PostsController();

router.get("/", postsController.getAll);
router.get("/:id", postsController.getById);
router.post("/", postsController.create);

export { router };
