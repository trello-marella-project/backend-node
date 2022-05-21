import PermissionService from "./permission.service";
import { Block, Card, Space } from "../utils/connect";

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
}

export default new WorkspaceService();
