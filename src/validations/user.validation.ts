import Joi from "joi";
import { password } from "./custom.validation";

export class UsersValidation {
  static createUser = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  });

  static getUser = Joi.object().keys({
    userId: Joi.string().uuid(),
  });

  static patchUser = {
    params: Joi.object().keys({
      id: Joi.string().uuid(),
    }),
    body: Joi.object()
      .keys({
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        username: Joi.string(),
      })
      .min(1),
  };

  static desactivateUser = {
    params: Joi.object().keys({
      id: Joi.string().uuid(),
    }),
  };
}
