import { User } from "../utils/connect";
import { UserAttributes } from "../models/user.module";

export const createUser = async (
  input: Omit<
    UserAttributes,
    "user_id" | "createdAt" | "updatedAt" | "is_enabled" | "is_blocked" | "role"
  >
) => {
  try {
    return await User.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
};
