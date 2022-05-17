import { Tag } from "../utils/connect";
import { NotFoundError } from "../errors";

class TagService {
  async addTags({ tags, spaceId }: { tags: string[]; spaceId: number }) {
    for (const tag in tags) {
      await Tag.create({ name: tags[tag], space_id: spaceId });
    }
  }

  async deleteTags({ tags, spaceId }: { tags: string[]; spaceId: number }) {
    for (const tag in tags) {
      const tagFromDb = await Tag.findOne({
        where: {
          name: tags[tag],
          space_id: spaceId,
        },
      });
      if (!tagFromDb) {
        throw new NotFoundError(`No task with id ${tagFromDb}`);
      }
      tagFromDb.destroy();
      tagFromDb.save();
    }
  }
}

export default new TagService();
