import { NextFunction, Request, Response } from "express";
import { CreateSpaceInput, UpdateSpaceInput } from "../schema/space.schema";
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
    next(error);
  }
};

const updateSpace = async (
  req: Request<{ space_id: string }, {}, UpdateSpaceInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { space_id: spaceId },
    } = req;

    await SpaceService.updateSpace({
      spaceId: Number(spaceId),
      input: { ...req.body },
      userId: res.locals.user.user_id,
    });
    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

// const getYoursSpaces = async (
//   req: Request<{}, {}, {}>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//   } catch (error) {
//     next(error)
//   }
// };
//
// const getPermittedSpaces = async (
//     req: Request<{}, {}, {}>,
//     res: Response,
//     next: NextFunction
// ) => {
//   try {
//   } catch (error) {
//     next(error)
//   }
// };
//
// const getPermittedSpaces = async (
//     req: Request<{}, {}, {}>,
//     res: Response,
//     next: NextFunction
// ) => {
//   try {
//   } catch (error) {
//     next(error)
//   }
// };


export { createSpace, updateSpace };
