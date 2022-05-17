import { NextFunction, Request, Response } from "express";
import { CreateSpaceInput } from "../schema/space.schema";
import SpaceService from "../service/space.service";

const createSpace = async (
  req: Request<{}, {}, CreateSpaceInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    await SpaceService.createSpace({
      input: { ...req.body },
      userId: res.locals.user.user_id,
    });
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log('error', error)
    next(error);
  }
};

export { createSpace };
