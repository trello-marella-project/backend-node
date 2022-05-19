import { Permission, Tag, User } from "../utils/connect";
import { UserAttributes } from "../models/user.model";
import { NotFoundError } from "../errors";

class UserService {
  async createUser(
    input: Pick<UserAttributes, "password" | "username" | "email">
  ) {
    try {
      return await User.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async checkUserIds({ input }: { input: number[] }) {
    for (const user_id in input) {
      const user = await User.findOne({
        where: { user_id: input[user_id] },
      });

      if (!user) throw new NotFoundError("User is not found");

      if (!user.is_enabled) {
        return new NotFoundError("User is not found");
      }
    }
  }

  async checkUserEmail(input: { email: string }) {
    const user = await User.findOne({
      where: { email: input.email },
    });
    if (!user) throw new NotFoundError("User is not found");

    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
    };
  }

  async addMembers({
    members,
    spaceId,
  }: {
    members: number[];
    spaceId: number;
  }) {
    for (const member in members) {
      await Permission.create({ user_id: members[member], space_id: spaceId });
    }
  }

  async deleteMembers({
    members,
    spaceId,
  }: {
    members: number[];
    spaceId: number;
  }) {
    for (const member in members) {
      const memberFromDb = await Permission.findOne({
        where: {
          user_id: members[member],
          space_id: spaceId,
        },
      });
      if (!memberFromDb) {
        throw new NotFoundError(`No member with id ${memberFromDb}`);
      }
      await memberFromDb.destroy();
      await memberFromDb.save();
    }
  }

  async getUsernameById({ user_id }: { user_id: number }) {
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user.username;
  }
}

export default new UserService();
