import { Response } from "express";

const throwError = (res: Response, error: any) => {
  if (process.env.NODE_ENV !== "production") console.error(error);

  res.status(error.statusCode);
  res.json({
    message: error.message,
    code: error?.statusCode
  });
};

export { throwError };
