import { Request, Response, NextFunction } from "express";
import { LoginUserInput, RegisterUserInput } from "../schema/user.schema";
import UserService from "../service/user.service";
import { omit, pick } from "lodash";

const register = async (
  req: Request<{}, {}, RegisterUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.register(req.body);
    res.status(200).send("OK");
  } catch (error: any) {
    next(error);
  }
};

const login = async (
  req: Request<{}, {}, LoginUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await UserService.login({ ...req.body });
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json(userData);
  } catch (error: any) {
    next(error);
  }
};

const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activationLink = req.params.link;
    await UserService.activate(activationLink);
    res.redirect(process.env.CLIENT_URL as string);
  } catch (error: any) {
    next(error);
  }
};

const refresh = async (req: Request, res: Response) => {
  res.send("meow");
};

export { register, login, activateUser, refresh };
