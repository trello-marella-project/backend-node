import { User } from "../utils/connect";
import { UserAttributes } from "../models/user.module";
import { BadRequestError } from "../errors";

export const registerUserService = async (
  input: Pick<UserAttributes, "password" | "username" | "email">
) => {
  // check username and email unique
  const candidateUsername = await User.findOne({
    where: { username: input.username },
  });
  if (candidateUsername)
    throw new BadRequestError(
      `User with username ${input.username} already exist`
    );

  const candidateEmail = await User.findOne({ where: { email: input.email } });
  if (candidateEmail)
    throw new BadRequestError(`User with email ${input.email} already exist`);

  const user = await createUser({ ...input });

  return { user };
};

export const createUser = async (
  input: Pick<UserAttributes, "password" | "username" | "email">
) => {
  try {
    return await User.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
};
