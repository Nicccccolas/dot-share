import Joi from "joi";
import { password } from "./custom.validation";

const register = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
});

const login = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
});

const logout = Joi.object().keys({
  refreshToken: Joi.string().required(),
});

const refreshTokens = Joi.object().keys({
  email: Joi.string().required().email(),
});

const forgotPassword = Joi.object().keys({
  email: Joi.string().required().email(),
});

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
