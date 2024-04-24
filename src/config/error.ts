import { HttpStatus } from "@/enums/https-status.enum";
import ErrorApi from "@/utils/errorApi";
import { Prisma } from "@prisma/client";
import { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import config from "./config";
import logger from "./logger";

export const errorConverter: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;
  if (!(error instanceof ErrorApi)) {
    const statusCode =
      error.statusCode || error instanceof Prisma.PrismaClientKnownRequestError
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || HttpStatus[statusCode];
    error = new ErrorApi(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHand: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { statusCode, message } = err;
  if (config.env == "production" && !err.isOperational) {
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    message = HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
