import { Response } from "express";

const handleHttp = (res: Response, error: string, errorRaw?: any) => {
  console.log(errorRaw);
  res.status(500);
  res.send({ error });
};

const throwError = (res: Response, error: any) => {
  if (process.env.NODE_ENV !== "production") console.error(error);

  res.status(error.statusCode);
  res.json({
    message: error.message,
    code: error?.statusCode
  });
};

export { handleHttp, throwError };
