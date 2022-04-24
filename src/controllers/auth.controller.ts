import { Request, Response } from "express";
import { RegisterUserInput } from "../schema/user.schema";
import UserService from "../service/user.service";
import { omit, pick } from "lodash";
import logger from "../utils/logger";

const register = async (
  req: Request<{}, {}, RegisterUserInput["body"]>,
  res: Response
) => {
  try {
    await UserService.register(req.body);
    res.status(200).send("OK");
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

const login = async (req: Request, res: Response) => {
  //res.status(200).send(pick(user.toJSON(), "username", "email"));
  res.cookie("refreshToken", "7662", {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.send("meow");
};

const activateUser = async (req: Request, res: Response) => {
  try {
    const activationLink = req.params.link;
    await UserService.activate(activationLink);
    res.redirect(process.env.CLIENT_URL as string);
  } catch (error: any) {
    logger.error(error);
  }
};

const refresh = async (req: Request, res: Response) => {
  res.send("meow");
};

export { register, login, activateUser, refresh };
