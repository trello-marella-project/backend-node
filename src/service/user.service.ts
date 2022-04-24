import * as uuid from "uuid";

import { User } from "../utils/connect";
import { UserAttributes } from "../models/user.module";
import { BadRequestError } from "../errors";
import MailService from "./mail.service";
import { TokenService } from "./token.service";

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

    //const user = await this.createUser({ ...input });
  }

  async login() {
    const tokens = TokenService.generateTokens({});
    await TokenService.saveToken({ user_id: 1, token: tokens.refreshToken });
  }

  async activate(activationLink: string) {

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
}

export default new UserService();
