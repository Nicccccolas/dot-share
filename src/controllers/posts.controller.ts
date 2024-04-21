import type { Post } from "@/models/post.model";
import { PostsService } from "@/services/posts.service";
import { throwError } from "@/utils/error.handlers";
import { Request, Response } from "express";

const postsService = new PostsService();

export class PostsController {
  public async getAll(_: Request, res: Response): Promise<void> {
    try {
      res.json({
        data: await postsService.getAll()
      });
    } catch (error: any) {
      throwError(res, error);
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const params = req.params;

    try {
      res.json({
        data: await postsService.getById({ postId: params.id })
      });
    } catch (error: any) {
      throwError(res, error);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    const post: Post = req.body;

    try {
      res.json({
        data: await postsService.create({ data: post })
      });
    } catch (error: any) {
      throwError(res, error);
    }
  }
}
