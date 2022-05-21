import PermissionService from "./permission.service";
import { Block, Card, Space } from "../utils/connect";
import { NotFoundError } from "../errors";

class WorkspaceService {
  async getWorkspaceById({
    workspaceId,
    userId,
  }: {
    workspaceId: number;
    userId: number;
  }) {
    await PermissionService.workspace({ spaceId: workspaceId, userId });

    const space = await Space.findOne({
      where: { space_id: workspaceId },
      include: [
        {
          model: Block,
          attributes: ["block_id", "name"],
          include: [
            {
              model: Card,
              attributes: ["card_id", "name", "description"],
            },
          ],
        },
      ],
    });

    return space;
  }

  async createBlock({
    input,
    workspaceId,
  }: {
    input: any;
    workspaceId: number;
  }) {
    // TODO change input any
    const block = await Block.create({
      name: input.name,
      space_id: workspaceId,
    });

    if (!block) throw new Error("Cant create block. Try again later");

    // TODO create dto
    return {
      block_id: block.block_id,
      name: block.name,
      space_id: block.space_id,
    };
  }

  async updateBlock({
    blockId,
    workspaceId,
    input,
  }: {
    input: any;
    workspaceId: number;
    blockId: number;
  }) {
    const block = await Block.findOne({
      where: { block_id: blockId, space_id: workspaceId },
    });

    if (!block) throw new NotFoundError("Block not found");

    block.name = input.name;
    await block.save();

    // TODO block update dto the same as in createBlock
    return {
      block_id: block.block_id,
      name: block.name,
      space_id: block.space_id,
    };
  }

  async deleteBlock({
    blockId,
    workspaceId,
  }: {
    workspaceId: number;
    blockId: number;
  }) {
    const block = await Block.findOne({
      where: { block_id: blockId, space_id: workspaceId },
    });

    if (!block) throw new NotFoundError("Block not found");

    await block.destroy();
    await block.save();
  }
}

export default new WorkspaceService();
