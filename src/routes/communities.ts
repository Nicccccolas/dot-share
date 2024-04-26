import { Router } from "express";
import { CommunitiesController } from "@/controllers/communities.controllers";
import auth from "@/middlewares/authorization.middleware";

const router: Router = Router();
const communityController = new CommunitiesController();

router.post("/", auth(), communityController.postCommunity);
router.get("/", communityController.getCommunities);
router.get("/:id", communityController.getCommunityById);

export = { router };
