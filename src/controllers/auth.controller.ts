import { Request, Response } from "express";
import { RegisterUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import { omit, pick } from "lodash";
import logger from "../utils/logger";

const register = async (
  req: Request<{}, {}, RegisterUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    res.status(200).send(pick(user.toJSON(), "username", "email"));
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
  res.status(200);
};

const activateUser = async (req: Request, res: Response) => {
  res.send("meow");
};

const activateUser = async (req: Request, res: Response) => {
  res.send("meow");
};

export { register };
