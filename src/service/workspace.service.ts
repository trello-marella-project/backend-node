import PermissionService from "./permission.service";
import { Block, Card, Permission, Space } from "../utils/connect";
import { NotFoundError } from "../errors";
import ConvertedService from "./converted.service";

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
      attributes: ["space_id", "is_public", "name", "user_id"],
      include: [
        {
          model: Permission,
          attributes: ["user_id"],
        },
        {
          model: Block,
          order: ["createdAt", "DESC"],
          attributes: ["block_id", "name", "createdAt"],
          include: [
            {
              model: Card,
              order: ["createdAt", "DESC"],
              attributes: ["card_id", "name", "description", "createdAt"],
            },
          ],
        },
      ],
    });

    return await ConvertedService.getConvertedWorkspace({ space });
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

  async createCard({
    workspaceId,
    input,
    blockId,
  }: {
    workspaceId: number;
    blockId: number;
    input: any;
  }) {
    // TODO проверка на суествованите блока
    // TODO change input any
    const card = await Card.create({
      block_id: blockId,
      name: input.name,
      description: input.description,
    });

    if (!card) throw new Error("Cant create block. Try again later");

    // TODO create dto
    return {
      block_id: card.block_id,
      name: card.name,
      description: card.description,
      card_id: card.card_id,
    };
  }

  async updateCard({
    workspaceId,
    blockId,
    cardId,
    input,
  }: {
    workspaceId: number;
    blockId: number;
    input: any;
    cardId: number;
  }) {
    const card = await Card.findOne({
      where: { block_id: blockId, card_id: cardId },
    });

    if (!card) throw new NotFoundError("Card not found");

    card.name = input.name;
    card.description = input.description;
    await card.save();

    return {
      block_id: card.block_id,
      name: card.name,
      description: card.description,
      card_id: card.card_id,
    };
  }

  async deleteCard({
    workspaceId,
    blockId,
    cardId,
  }: {
    workspaceId: number;
    blockId: number;
    cardId: number;
  }) {
    const card = await Card.findOne({
      where: { block_id: blockId, card_id: cardId },
    });

    if (!card) throw new NotFoundError("Card not found");

    await card.destroy();
    await card.save();
  }
}

export default new WorkspaceService();
