import { Report, User } from "../utils/connect";
import { BadRequestError, NotFoundError } from "../errors";
import { changeReportStatus } from "../controllers/reports.controller";

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

  async getAllReports() {
    // TODO сделать адекватно с нормаьными join
    const reports = await Report.findAll({
      // attributes: [""],
      order: [["createdAt", "DESC"]],
    });

    const convertedReports = [];

    for (const reportId in reports) {
      const accusedUser = await User.findOne({
        where: { user_id: reports[reportId].accused_user_id },
        attributes: ["username", "user_id", "email"],
      });

      if (!accusedUser) throw new NotFoundError("Accused user not found");

      const declarerUser = await User.findOne({
        where: { user_id: reports[reportId].declarer_user_id },
        attributes: ["username", "user_id", "email"],
      });

      if (!declarerUser) throw new NotFoundError("Accused user not found");

      convertedReports.push({
        report_id: reports[reportId].report_id,
        message: reports[reportId].message,
        declarer: declarerUser,
        accused: accusedUser,
      });
    }

    return convertedReports;
  }

  async changeReportStatus({
    reportId,
    input,
  }: {
    reportId: number;
    input: any;
  }) {
    // TODO change any

    const report = await Report.findOne({ where: { report_id: reportId } });

    if (!report) throw new NotFoundError("Report not found");

    if (input.status === "ACCEPTED") {
      const user = await User.findOne({
        where: { user_id: report.accused_user_id },
      });

      if (!user) throw new NotFoundError("User not found");

      user.is_blocked = true;
      await user.save();
    }

    await report.destroy();
    await report.save();
  }
}

export default new ReportService();
