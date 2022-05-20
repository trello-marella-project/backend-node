import { NextFunction, Request, Response } from "express";
import WorkspaceService from "../service/workspace.service";

const getWorkspaceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await WorkspaceService.getWorkspaceById();
  } catch (error) {
    next(error);
  }
};

export { getWorkspaceById };
