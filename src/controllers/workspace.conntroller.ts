import { NextFunction, Request, Response } from "express";
import WorkspaceService from "../service/workspace.service";
import {
  WorkspaceBlockInput,
  WorkspaceCardInput,
} from "../schema/workspace.schema";

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
  req: Request<{ workspace_id: string }, {}, WorkspaceBlockInput>,
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
    WorkspaceBlockInput
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

const deleteBlock = async (
  req: Request<{ workspace_id: string; block_id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { workspace_id: workspaceId, block_id: blockId },
    } = req;

    await WorkspaceService.deleteBlock({
      blockId: Number(blockId),
      workspaceId: Number(workspaceId),
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

const createCard = async (
  req: Request<
    { workspace_id: string; block_id: string },
    {},
    WorkspaceCardInput
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { workspace_id: workspaceId, block_id: blockId },
    } = req;

    const card = await WorkspaceService.createCard({
      workspaceId: Number(workspaceId),
      blockId: Number(blockId),
      input: { ...req.body },
    });

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

const updateCard = async (
  req: Request<
    { workspace_id: string; block_id: string; card_id: string },
    {},
    WorkspaceCardInput
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { workspace_id: workspaceId, block_id: blockId, card_id: cardId },
    } = req;

    const card = await WorkspaceService.updateCard({
      workspaceId: Number(workspaceId),
      blockId: Number(blockId),
      cardId: Number(cardId),
      input: { ...req.body },
    });

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

const deleteCard = async (
  req: Request<
    { workspace_id: string; block_id: string; card_id: string },
    {},
    {}
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { workspace_id: workspaceId, block_id: blockId, card_id: cardId },
    } = req;

    await WorkspaceService.deleteCard({
      workspaceId: Number(workspaceId),
      blockId: Number(blockId),
      cardId: Number(cardId),
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export {
  getWorkspaceById,
  createBlock,
  updateBlock,
  deleteBlock,
  deleteCard,
  updateCard,
  createCard,
};
