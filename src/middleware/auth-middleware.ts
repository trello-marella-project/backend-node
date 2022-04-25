import { UnauthenticatedError } from "../errors/unauthenticated";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(new UnauthenticatedError("Authentication invalid"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new UnauthenticatedError("Authentication invalid"));
    }

    const userData = verifyJwt(token, "JWT_ACCESS_SECRET");
    if (!userData.valid) {
      return next(new UnauthenticatedError("Authentication invalid"));
    }

    res.locals.user = userData.decoded;

    next();
  } catch (error: any) {
    return next(new UnauthenticatedError("Authentication invalid"));
  }
};
