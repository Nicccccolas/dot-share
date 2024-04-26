import { CommunitiesService } from "@/services/communities.services";
import { throwError } from "@/utils/error.handlers";
import { User } from "@prisma/client";
import { Request, Response } from "express";

const communitiesService = new CommunitiesService();

export class CommunitiesController {
  constructor() {}

  async postCommunity(req: Request, res: Response) {
    const { name, description } = req.body;
    const user = req.user as User;
    console.log("USER: ", user);

    try {
      const community = await communitiesService.createCommunity(
        name,
        description,
        user,
      );
      res.status(201).json(community);
    } catch (error) {
      throwError(res, error);
    }
  }

  async getCommunities(req: Request, res: Response) {
    try {
      const communities = await communitiesService.findAllCommunities();
      res.status(200).json(communities);
    } catch (error) {
      throwError(res, error);
    }
  }

  async getCommunityById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const community = await communitiesService.findCommunityById(id);
      res.status(200).json(community);
    } catch (error) {
      throwError(res, error);
    }
  }
}
