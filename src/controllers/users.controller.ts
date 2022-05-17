import { NextFunction, Request, Response } from "express";

import UserService from "../service/user.service";
import { CheckUserEmailInput } from "../schema/user.schema";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("cool");
};

const checkEmailExistence = async (
  req: Request<{}, {}, CheckUserEmailInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.checkUserEmail({ email: req.body.email });
    res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
};

export { getAllUsers, checkEmailExistence };
