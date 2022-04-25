import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import TokenService from "../service/token.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next();
  }

  const token = authHeader!.split(" ")[1];
  if (!token) {
    return next();
  }

  const { decoded, expired } = verifyJwt(token, "JWT_ACCESS_SECRET");
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  const { refreshToken } = req.cookies;
  if (expired && refreshToken) {
    const newAccessToken = await TokenService.reIssueAccessToken({
      refreshToken,
    });

    if (newAccessToken) {
      res.setHeader("Authorization", newAccessToken);
    }

    const result = verifyJwt(newAccessToken as string, "JWT_ACCESS_SECRET");
    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export { deserializeUser };
