import Joi from "joi";

export const password: Joi.CustomValidator = (value, helpers) => {
  if (value.length < 8) {
    return helpers.error("Pastword must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.error("Password must contain at least 1 letter and number");
  }
  return value;
};
