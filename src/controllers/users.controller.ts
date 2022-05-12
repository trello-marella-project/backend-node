import { NextFunction, Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("cool");
};

const checkEmailExistence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).send("cool");
};

export { getAllUsers, checkEmailExistence };
