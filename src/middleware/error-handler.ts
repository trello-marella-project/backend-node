import { CustomApiAttributes } from "../errors/custom-api";
import { Request, Response, NextFunction } from "express";

const errorHandlerMiddleware = (
  err: Error & CustomApiAttributes,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || "Something went wrong try again later",
  };
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export { errorHandlerMiddleware };
