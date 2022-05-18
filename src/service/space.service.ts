import { Permission, Space } from "../utils/connect";
import UserService from "./user.service";
import TagService from "./tag.service";
import { ForbiddenError, NotFoundError } from "../errors";
import { SpaceModel } from "models/space.model";

interface getSpacesI {
  userId?: number;
  page: string | undefined;
  limit: string | undefined;
}

interface paginationI {
  page: string | undefined;
  limit: string | undefined;
}

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

  async getYoursSpaces({ userId, page, limit: rowLimit }: getSpacesI) {
    const { limit, offset } = this.getPaginationProperties({
      page,
      limit: rowLimit,
    });

    const spaces = await Space.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    return await this.getConvertedSpaces({ spaces });
  }

  async getPermittedSpaces({ userId, page, limit: rowLimit }: getSpacesI) {
    const { limit, offset } = this.getPaginationProperties({
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

    return await this.getConvertedSpaces({ spaces });
  }

  async getConvertedSpaces({ spaces }: { spaces: SpaceModel[] }) {

    // TODO убрать и изменить на джоины (возможносоздать индекс)
    let convertedSpaces = [];
    for (const id in spaces) {
      const username = await UserService.getUsernameById({
        user_id: spaces[id].user_id,
      });
      convertedSpaces.push({
        space_id: spaces[id].space_id,
        name: spaces[id].name,
        is_public: spaces[id].is_public,
        username,
      });
    }

    return convertedSpaces;
  }

  getPaginationProperties({ page: rowPage, limit: rowLimit }: paginationI) {
    const page = Number(rowPage) || 1;
    const limit = Number(rowLimit) || 10;
    const offset = (page - 1) * limit;
    return { limit, offset };
  }
}

export default new SpaceService();
