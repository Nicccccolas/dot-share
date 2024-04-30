import Joi from "joi";

export class CommunitiesValidation {
  static postCommunity = {
    user: Joi.object().keys({
      id: Joi.string().required(),
    }),
  };

  // static getCommunities = Joi.object().keys({});

  static getCommunity = Joi.object().keys({
    id: Joi.string().required(),
  });
}
