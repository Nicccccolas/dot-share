import Joi from "joi";
import { password } from "./custom.validation";

export class AuthValidation {
  static register = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  });

  static login = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  });

  static logout = Joi.object().keys({
    refreshToken: Joi.string().required(),
  });

  static refreshTokens = Joi.object().keys({
    email: Joi.string().required().email(),
  });

  static forgotPassword = Joi.object().keys({
    email: Joi.string().required().email(),
  });

  static resetPassword = {
    query: Joi.object().keys({
      token: Joi.string().required(),
    }),
    body: Joi.object().keys({
      password: Joi.string().required().custom(password),
    }),
  };
}
