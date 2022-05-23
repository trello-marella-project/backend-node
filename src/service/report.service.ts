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
}

export default new ReportService();
