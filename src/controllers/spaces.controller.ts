import { NextFunction, Request, Response } from "express";

const createSpace = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("cool");
};

export { createSpace };
