import { Report, User } from "../utils/connect";
import { BadRequestError, NotFoundError } from "../errors";

class ReportService {
  async createReport({
    declarerId,
    accusedId,
    input,
  }: {
    declarerId: number;
    accusedId: number;
    input: any;
  }) {
    // TODO change any
    // TODO разобраться с базой данный чтобы не было user_id
    if (accusedId === declarerId)
      throw new BadRequestError("You cannot accuse yourself");

    const accusedUser = await User.findOne({ where: { user_id: accusedId } });

    if (!accusedUser) throw new NotFoundError("Accused user not found");

    await Report.create({
      message: input.message,
      accused_user_id: accusedId,
      declarer_user_id: declarerId,
    });
  }

  async changeUserIsBlocked({ userId, input }: { userId: number; input: any }) {
    const user = await User.findOne({
      where: { user_id: userId, is_enabled: true },
    });

    if (!user) throw new NotFoundError("User not found");

    user.is_blocked = input.is_blocked;
    await user.save();
  }
}

export default new ReportService();
