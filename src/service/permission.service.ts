import { Permission, Space } from "../utils/connect";
import { ForbiddenError } from "../errors";

class PermissionService {
  async getSpaceById({ spaceId, userId }: { spaceId: number; userId: number }) {
    const permission = await Permission.findOne({
      where: { space_id: spaceId, user_id: userId },
    });
    const space = await Space.findOne({ where: { space_id: spaceId } });

    if (
      !space ||
      !space.is_public ||
      (space?.user_id !== userId && !permission)
    ) {
      throw new ForbiddenError("Dont have access to space");
    }
  }
}

export default new PermissionService();
