import * as uuid from "uuid";

import { ActivationLink, User } from "../utils/connect";
import { UserAttributes } from "../models/user.module";
import { BadRequestError, NotFoundError } from "../errors";
import MailService from "./mail.service";
import TokenService from "./token.service";
import logger from "../utils/logger";
import * as bcrypt from "bcryptjs";
import { UserDto } from "../dtos/user-dto";

class UserService {
  async register(
    input: Pick<UserAttributes, "password" | "username" | "email">
  ) {
    // check username and email unique
    const candidateUsername = await User.findOne({
      where: { username: input.username },
    });
    if (candidateUsername)
      throw new BadRequestError(
        `User with username ${input.username} already exist`
      );

    const candidateEmail = await User.findOne({
      where: { email: input.email },
    });
    if (candidateEmail)
      throw new BadRequestError(`User with email ${input.email} already exist`);

    const activationLink = uuid.v4();
    await MailService.sendActivationMail({
      email: input.email,
      link: `${process.env.API_URL}/api/auth/activate/${activationLink}`,
    });

    logger.info("activationLink", activationLink);

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

    const isPasswordCorrect = await bcrypt.compare(
      input.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new BadRequestError("Password incorrect");
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({
      email: user.email,
      userId: user.user_id,
    });
    await TokenService.saveToken({
      user_id: user.user_id as number,
      token: tokens.refreshToken,
    });

    return { ...tokens, user: { ...userDto } };
  }

  async activate(activationLink: string) {
    const link = await ActivationLink.findOne({
      where: { link: activationLink },
    });

    if (!link) {
      throw new NotFoundError("Некорректная ссылка для активации");
    }

    const user = await User.findOne({ where: { user_id: link.user_id } });
    user!.is_enabled = true;
    await user!.save();

    await link.destroy();
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
