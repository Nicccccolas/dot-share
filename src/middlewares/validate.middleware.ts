import Joi from "joi";
import pick from "@/utils/pick";
import { Request, Response, NextFunction } from "express";
import ErrorApi from "@/utils/errorApi";
import { HttpStatus } from "@/enums/https-status.enum";

export const validate =
  (schema: object) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const obj = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(obj);
    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new ErrorApi(HttpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };
