import { Token } from "../utils/connect";
import { TokenAttributes } from "../models/token.module";
import logger from "../utils/logger";

export const saveToken = async (
  input: Pick<TokenAttributes, "token" | "user_id">
) => {
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
};

export const findToken = async (token: string) => {
  return await Token.findOne({ where: { token } });
};
