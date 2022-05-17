import { Space } from "../utils/connect";
import UserService from "./user.service";
import TagService from "./tag.service";

class SpaceService {
  async createSpace({ input, userId }: { input: any; userId: number }) {
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
}

export default new SpaceService();
