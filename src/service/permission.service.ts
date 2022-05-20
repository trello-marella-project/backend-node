import { Permission, Space } from "../utils/connect";
import { ForbiddenError } from "../errors";

class PermissionService {
  async getSpaceById({ spaceId, userId }: { spaceId: number; userId: number }) {
    const permission = await Permission.findOne({
      where: { space_id: spaceId, user_id: userId },
    });
    const space = await Space.findOne({ where: { space_id: spaceId } });

    if (!permission || !space || !space.is_public || space.user_id !== userId) {
      throw new ForbiddenError("Dont have access to space");
    }
  }
}

export default new PermissionService();
