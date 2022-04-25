import { TokenAttributes } from "../models/token.module";
import { PayloadI, signJwt, verifyJwt } from "../utils/jwt.utils";
import { Token, User } from "../utils/connect";
import { UserRoleType } from "../models/user.module";

class TokenService {
  async reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJwt(refreshToken, "JWT_REFRESH_SECRET");
    if (!decoded) return false;

    const tokenFromDb = await this.findToken(refreshToken);
    if (!tokenFromDb) return false;

    const user = await User.findOne({
      where: { user_id: tokenFromDb.user_id },
    });
    if (!user) return false;

    return signJwt(
      {
        user_id: Number(user.user_id),
        email: user.email,
        role: user.role as UserRoleType,
      },
      "JWT_ACCESS_SECRET",
      "JWT_ACCESS_LIFETIME"
    );
  }

  async generateAndSaveTokens(payload: PayloadI) {
    const tokens = this.generateTokens({ ...payload });

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
    console.log("tokenData", tokenData);
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
