import { Request, Response, NextFunction } from "express";
import { LoginUserInput, RegisterUserInput } from "../schema/user.schema";
import AuthService from "../service/auth.service";

const register = async (
  req: Request<{}, {}, RegisterUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    await AuthService.register(req.body);
    res.status(200).json({ status: "success" });
  } catch (error: any) {
    next(error);
  }
};

const login = async (
  req: Request<{}, {}, LoginUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await AuthService.login({ ...req.body });
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json(userData);
  } catch (error: any) {
    next(error);
  }
};

const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activationLink = req.params.link;
    await AuthService.activate(activationLink);
    res.redirect(process.env.CLIENT_URL as string);
  } catch (error: any) {
    next(error);
  }
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const userData = await AuthService.refresh(refreshToken);
  res.cookie("refreshToken", userData.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return res.status(200).json(userData);
};

export { register, login, activateUser, refresh };
