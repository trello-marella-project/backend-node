import { NextFunction, Request, Response } from "express";
import { CreateSpaceInput, UpdateSpaceInput } from "../schema/space.schema";
import SpaceService from "../service/space.service";
import TagService from "../service/tag.service";

type SpacesQuery = {
  limit?: string;
  page?: string;
  tags?: string;
  search?: string;
};

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

const getSpaceById = async (
  req: Request<{ space_id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { space_id: spaceId },
    } = req;

    const space = await SpaceService.getSpaceById({
      spaceId: Number(spaceId),
      userId: res.locals.user.user_id,
    });

    res.status(200).json(space);
  } catch (error) {
    next(error);
  }
};

const getYoursSpaces = async (
  req: Request<{}, {}, {}, SpacesQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const spaces = await SpaceService.getYoursSpaces({
      userId: res.locals.user.user_id,
      page,
      limit,
    });

    res.status(200).json({ spaces });
  } catch (error) {
    next(error);
  }
};

const getPermittedSpaces = async (
  req: Request<{}, {}, {}, SpacesQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;

    const spaces = await SpaceService.getPermittedSpaces({
      userId: res.locals.user.user_id,
      page,
      limit,
    });

    res.status(200).json({ spaces });
  } catch (error) {
    next(error);
  }
};

const getAllSpaces = async (
  req: Request<{}, {}, {}, SpacesQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, search, tags } = req.query;

    const spaces = await SpaceService.getAllSpaces({
      tags,
      search,
      limit,
      page,
    });

    res.status(200).json({ spaces });
  } catch (error) {
    next(error);
  }
};

const getRecentSpaces = async (
  req: Request<{}, {}, {}, SpacesQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getAllTags = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await TagService.getAllTags();

    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
};

export {
  createSpace,
  getAllTags,
  updateSpace,
  getRecentSpaces,
  getAllSpaces,
  getYoursSpaces,
  getPermittedSpaces,
  getSpaceById,
};
