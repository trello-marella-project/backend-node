import { Request, Response, NextFunction } from "express";

const userPermission = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user && !(user.role === "USER")) {
    return res.sendStatus(403);
  }

  return next();
};

const adminPermission = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user && !(user.role === "ADMIN")) {
    return res.sendStatus(403);
  }

  return next();
};

export { adminPermission, userPermission };
