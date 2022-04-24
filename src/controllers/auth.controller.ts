import { Request, Response } from "express";
import { RegisterUserInput } from "../schema/user.schema";
import { createUser, registerUserService } from "../service/user.service";
import { omit, pick } from "lodash";
import logger from "../utils/logger";

const register = async (
  req: Request<{}, {}, RegisterUserInput["body"]>,
  res: Response
) => {
  try {
    const { user } = await registerUserService(req.body);
    res.status(200).send(pick(user.toJSON(), "username", "email"));
  } catch (error: any) {
    console.log(error);
    res.status(409).send(error.message);
  }
  res.status(200);
};

const login = async (req: Request, res: Response) => {
  res.send("meow");
};

const activateUser = async (req: Request, res: Response) => {
  res.send("meow");
};

const refresh = async (req: Request, res: Response) => {
  res.send("meow");
};

export { register, login, activateUser, refresh };
