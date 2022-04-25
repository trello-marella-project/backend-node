import { TokenAttributes } from "../models/token.module";
import { signJwt } from "../utils/jwt.utils";
import { Token } from "../utils/connect";

interface PayloadI {
  email: string;
  user_id: number;
}

class TokenService {
  async generateAndSaveTokens(payload: PayloadI) {
    const tokens = this.generateTokens({
      email: payload.email,
      user_id: payload.user_id,
    });
    await this.saveToken({
      user_id: payload.user_id,
      token: tokens.refreshToken,
    });

    return {
      ...tokens,
    };
  }

  generateTokens(payload: PayloadI): {
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

  async saveToken(input: Pick<TokenAttributes, "token" | "user_id">) {
    const tokenData = await Token.findOne({
      where: { user_id: input.user_id },
    });
    if (tokenData) {
      tokenData.token = input.token;
      return await tokenData.save();
    }
    return await Token.create({ ...input });
  }

  async findToken(token: string) {
    return await Token.findOne({ where: { token } });
  }
}

export default new TokenService();
