import { Space } from "../utils/connect";
import UserService from "./user.service";
import TagService from "./tag.service";
import { ForbiddenError } from "../errors";

class SpaceService {
  async createSpace({ input, userId }: { input: any; userId: number }) {
    // TODO change any
    await UserService.checkUserIds({ input: input.members });
    const space = await Space.create({
      name: input.name,
      user_id: userId,
      is_public: input.is_public,
    });

    await TagService.addTags({ tags: input.tags, spaceId: space.space_id! });
    await UserService.addMembers({
      members: input.members,
      spaceId: space.space_id!,
    });
  }

  async updateSpace({
    input,
    spaceId,
    userId,
  }: {
    input: any;
    spaceId: number;
    userId: number;
  }) {
    // TODO change any

    // check space existence
    const space = await Space.findOne({
      where: { space_id: spaceId, user_id: userId },
    });
    if (!space) throw new ForbiddenError("no edit access");

    // check members existence
    await UserService.checkUserIds({ input: input.members.added });
    await UserService.checkUserIds({ input: input.members.deleted });

    // toggle members
    await UserService.addMembers({
      members: input.members.added,
      spaceId,
    });
    await UserService.deleteMembers({
      members: input.members.deleted,
      spaceId,
    });

    // toggle tags
    await TagService.addTags({ tags: input.tags.added, spaceId });
    await TagService.deleteTags({ tags: input.tags.deleted, spaceId });

    // change space name
    if (space.name !== input.name) {
      space.name = input.name;
      space.save();
    }

    // change space public property
    if (space.is_public !== input.is_public) {
      space.is_public = input.is_public;
      space.save();
    }
  }
}

export default new SpaceService();
