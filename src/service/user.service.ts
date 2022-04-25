import * as uuid from "uuid";
import * as bcrypt from "bcryptjs";

import { ActivationLink, User } from "../utils/connect";
import { UserAttributes, UserRoleType } from "../models/user.module";
import {
  BadRequestError,
  CustomApiError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import MailService from "./mail.service";
import TokenService from "./token.service";
import { verifyJwt } from "../utils/jwt.utils";

class UserService {
  async register(
    input: Pick<UserAttributes, "password" | "username" | "email">
  ) {
    // check username unique
    const candidateUsername = await User.findOne({
      where: { username: input.username },
    });
    if (candidateUsername)
      throw new BadRequestError(
        `User with username ${input.username} already exist`
      );

    // check email unique
    const candidateEmail = await User.findOne({
      where: { email: input.email },
    });
    if (candidateEmail)
      throw new BadRequestError(`User with email ${input.email} already exist`);

    // create link for mail
    const activationLink = uuid.v4();
    await MailService.sendActivationMail({
      email: input.email,
      link: `${process.env.API_URL}/api/auth/activate/${activationLink}`,
    });

    // create user
    const user = await this.createUser({ ...input });
    await this.saveActivationLink({
      user_id: user.user_id as number,
      link: activationLink,
    });
  }

  async login(input: Pick<UserAttributes, "password" | "email">) {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) {
      throw new BadRequestError(`User with email ${input.email} not found`);
    }

    // compare passwords
    const isPasswordCorrect = await bcrypt.compare(
      input.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new BadRequestError("Password incorrect");
    }

    if (!user.is_enabled) {
      throw new CustomApiError(
        "please confirm your registration by email",
        403
      );
    }

    const tokens = await TokenService.generateAndSaveTokens({
      email: user.email,
      user_id: user.user_id as number,
      role: user.role as UserRoleType,
    });

    return {
      ...tokens,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        is_enabled: user.is_enabled,
      },
    };
  }

  async activate(activationLink: string) {
    const link = await ActivationLink.findOne({
      where: { link: activationLink },
    });

    if (!link) {
      throw new NotFoundError("Invalid activation link");
    }

    const user = await User.findOne({ where: { user_id: link.user_id } });
    user!.is_enabled = true;
    await user!.save();

    await link.destroy();
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthenticatedError("User is not authorized");
    }

    const userData = verifyJwt(refreshToken, "JWT_REFRESH_SECRET");
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData.valid || !tokenFromDb) {
      throw new UnauthenticatedError("User is not authorized");
    }

    const user = await User.findOne({
      where: { user_id: tokenFromDb.user_id },
    });
    if (!user) {
      throw new NotFoundError("User is not found");
    }

    const tokens = await TokenService.generateAndSaveTokens({
      email: user.email,
      user_id: user.user_id as number,
      role: user.role as UserRoleType,
    });

    return {
      ...tokens,
    };
  }

  async createUser(
    input: Pick<UserAttributes, "password" | "username" | "email">
  ) {
    try {
      return await User.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async saveActivationLink(input: { link: string; user_id: number }) {
    try {
      await ActivationLink.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new UserService();
