import { TokenAttributes } from "../models/token.module";
import logger from "../utils/logger";
import { signJwt } from "../utils/jwt.utils";
import { Token } from "utils/connect";

class TokenService {
  static generateTokens(payload: any): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = signJwt(
      payload,
      "JWT_ACCESS_SECRET",
      "JWT_ACCESS_LIFETIME"
    );
    const refreshToken = signJwt(
      payload,
      "JWT_REFRESH_SECRET",
      "JWT_REFRESH_LIFETIME"
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  static async saveToken(input: Pick<TokenAttributes, "token" | "user_id">) {
    try {
      const tokenData = await Token.findOne({
        where: { user_id: input.user_id },
      });
      if (tokenData) {
        tokenData.token = input.token;
        return await tokenData.save();
      }
      return await Token.create({ ...input });
    } catch (error: any) {
      logger.error(error);
    }
  }

  static async findToken(token: string) {
    return await Token.findOne({ where: { token } });
  }
}

export { TokenService };
