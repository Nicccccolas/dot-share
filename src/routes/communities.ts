import { Router } from "express";
import { CommunitiesController } from "@/controllers/communities.controllers";
import { validate } from "@/middlewares/validate.middleware";
import communityValidation from "@/validations/community.validation";
import auth from "@/middlewares/authorization.middleware";

const communityController = new CommunitiesController();

const router: Router = Router();

router.post(
  "/",
  validate(communityValidation.postCommunity),
  auth(),
  communityController.postCommunity,
);
router.get("/", communityController.getCommunities);
router.get(
  "/:id",
  validate(communityValidation.getCommunity),
  communityController.getCommunityById,
);

export = { router };
