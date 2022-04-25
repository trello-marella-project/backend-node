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
    next();
  }

  const token = authHeader!.split(" ")[1];
  if (!token) {
    next();
  }

  const { decoded, expired } = verifyJwt(token, "JWT_ACCESS_SECRET");
  if (decoded) {
    res.locals.user = decoded;
    next();
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
    next();
  }

  next();
};

export { deserializeUser };
