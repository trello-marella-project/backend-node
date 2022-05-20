import { Entrance, Permission, Space, Tag } from "../utils/connect";
import UserService from "./user.service";
import TagService from "./tag.service";
import { ForbiddenError, NotFoundError } from "../errors";
import { SpaceModel } from "models/space.model";
import sequelize, { Op } from "sequelize";
import ConvertedService from "./converted.service";
import PermissionService from "./permission.service";
import { getPaginationProperties } from "../utils/helpers";

interface getSpacesI {
  userId?: number;
  page: string | undefined;
  limit: string | undefined;
  search?: string | undefined;
  tags?: string | undefined;
}

class SpaceService {
  async createSpace({
    input,
    userId,
  }: {
    input: any;
    //input: CreateSpaceInput["body"];
    userId: number;
  }) {
    // TODO change any
    await UserService.checkUserIds({ input: input.members });
    const space = await Space.create({
      name: input.name,
      user_id: userId,
      is_public: input.is_public,
    });

    if (!space) throw new Error("Space not created, try again later");

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

    // delete all members permissions if is_public changed on true
    if (space.is_public !== input.is_public && input.is_public) {
      const members = await Permission.findAll({
        where: { space_id: spaceId },
      });
      for (const memberId in members) {
        await members[memberId].destroy();
        await members[memberId].save();
      }
    }

    // delete all tags permissions if is_public changed on false
    if (space.is_public !== input.is_public && !input.is_public) {
      const tags = await Tag.findAll({ where: { space_id: spaceId } });
      for (const tagId in tags) {
        await tags[tagId].destroy();
        await tags[tagId].save();
      }
    }

    // change space public property
    if (space.is_public !== input.is_public) {
      space.is_public = input.is_public;
      space.save();
    }
  }

  async getSpaceById({ spaceId, userId }: { spaceId: number; userId: number }) {
    await PermissionService.getSpaceById({ spaceId, userId });

    const space = await Space.findOne({
      include: [
        {
          model: Tag,
          attributes: ["name"],
        },
        {
          model: Permission,
          attributes: ["user_id"],
        },
      ],
      where: { space_id: spaceId },
      attributes: ["is_public", "name"],
    });

    if (!space) throw new NotFoundError("Space not found");

    // update or create user entrance time
    const user = await Entrance.findOne({ where: { user_id: userId } });
    if (!user) {
      await Entrance.create({
        user_id: userId,
        space_id: spaceId,
      });
    } else {
      await Entrance.update(
        { time: sequelize.literal("CURRENT_TIMESTAMP") },
        { where: { user_id: userId } }
      );
    }

    return await ConvertedService.getConvertedSpace({ space });
  }

  async getAllSpaces({
    page,
    limit: rowLimit,
    tags: rowTags,
    search,
  }: getSpacesI) {
    const { limit, offset } = getPaginationProperties({
      page,
      limit: rowLimit,
    });

    const tags = rowTags ? rowTags.split(",") : null;

    // TODO сделать нормальный возврат тегов
    const spaces = await Space.findAll({
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: ["name"],
          where: tags
            ? {
                "$tags.name$": tags,
              }
            : {},
          // required: true,
          // subQuery: false,
          // duplicating: false,
        },
      ],
      where: !!search
        ? {
            is_public: true,
            name: {
              [Op.like]: `%${search}%`,
            },
            // [Op.or]: [
            //   {
            //     "$tags.name$": tags
            //   }
            // ]

            // "$tags.name$": tags,
          }
        : { is_public: true },
      order: [["createdAt", "DESC"]],
      attributes: ["space_id", "name", "createdAt", "user_id"],
      offset,
      limit,
    });

    return await ConvertedService.getConvertedAllSpaces({ spaces });
  }

  async getYoursSpaces({ userId, page, limit: rowLimit }: getSpacesI) {
    const { limit, offset } = getPaginationProperties({
      page,
      limit: rowLimit,
    });

    const spaces = await Space.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    return await ConvertedService.getConvertedSpaces({ spaces });
  }

  async getRecentSpaces({ userId, page, limit: rowLimit }: getSpacesI) {
    const { limit, offset } = getPaginationProperties({
      page,
      limit: rowLimit,
    });

    const entrances = await Entrance.findAll({
      where: { user_id: userId },
      order: [["time", "DESC"]],
      offset,
      limit,
    });

    const spaces = [];

    for (const entranceId in entrances) {
      const space = await Space.findOne({
        where: { space_id: entrances[entranceId].space_id },
      });
      if (!space) throw new NotFoundError("Space not found");
      spaces.push(space);
    }

    return await ConvertedService.getConvertedSpaces({ spaces });
  }

  async getPermittedSpaces({ userId, page, limit: rowLimit }: getSpacesI) {
    const { limit, offset } = getPaginationProperties({
      page,
      limit: rowLimit,
    });

    const permissions = await Permission.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    const spaces: SpaceModel[] = [];
    for (const id in permissions) {
      const space = await Space.findOne({
        where: { space_id: permissions[id].space_id },
      });
      if (!space) throw new NotFoundError("Space not found");
      spaces.push(space);
    }

    return await ConvertedService.getConvertedSpaces({ spaces });
  }

  async deleteSpace({ userId, spaceId }: { userId: number; spaceId: number }) {
    const space = await Space.findOne({ where: { space_id: spaceId } });

    if (!space) throw new NotFoundError("Space not found");
    if (space.user_id !== userId)
      throw new ForbiddenError("You are not the owner of the space");

    // find and delete all tags
    const tags = await Tag.findAll({ where: { space_id: spaceId } });
    for (const tagId in tags) {
      await tags[tagId].destroy();
      await tags[tagId].save();
    }

    // find and delete all members
    const members = await Permission.findAll({ where: { space_id: spaceId } });
    for (const memberId in members) {
      await members[memberId].destroy();
      await members[memberId].save();
    }

    // find and delete all entrances
    const entrances = await Entrance.findAll({ where: { space_id: spaceId } });
    for (const entranceId in entrances) {
      await entrances[entranceId].destroy();
      await entrances[entranceId].save();
    }

    await space.destroy();
    await space.save();
  }
}

export default new SpaceService();
