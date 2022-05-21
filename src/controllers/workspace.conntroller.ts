import { NextFunction, Request, Response } from "express";
import WorkspaceService from "../service/workspace.service";
import { CreateWorkspaceBlockInput } from "../schema/workspace.schema";

const getWorkspaceById = async (
  req: Request<{ workspace_id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { workspace_id: workspaceId },
    } = req;

    const workspace = await WorkspaceService.getWorkspaceById({
      workspaceId: Number(workspaceId),
      userId: res.locals.user.user_id,
    });

    res.status(200).json(workspace);
  } catch (error) {
    next(error);
  }
};

const createBlock = async (
  req: Request<{ workspace_id: string }, {}, CreateWorkspaceBlockInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { workspace_id: workspaceId },
    } = req;
    const block = await WorkspaceService.createBlock({
      input: { ...req.body },
      workspaceId: Number(workspaceId),
    });

    // TODO change 200 on 201
    res.status(200).json(block);
  } catch (error) {
    next(error);
  }
};

const updateBlock = async (
  req: Request<
    { workspace_id: string; block_id: string },
    {},
    CreateWorkspaceBlockInput
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { workspace_id: workspaceId, block_id: blockId },
    } = req;

    const block = await WorkspaceService.updateBlock({
      input: { ...req.body },
      workspaceId: Number(workspaceId),
      blockId: Number(blockId),
    });

    res.status(200).json(block);
  } catch (error) {
    next(error);
  }
};

export { getWorkspaceById, createBlock, updateBlock };
