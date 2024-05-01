import Joi from "joi";

const postCommunity = {
  user: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

// static getCommunities = Joi.object().keys({});

const getCommunity = Joi.object().keys({
  id: Joi.string().required(),
});

export = { postCommunity, getCommunity };
