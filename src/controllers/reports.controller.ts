import { NextFunction, Request, Response } from "express";
import ReportService from "../service/report.service";

const getAllReports = async (
  req: Request<{ report_id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const reports = await ReportService.getAllReports();
    res.status(200).json({ reports });
  } catch (error) {
    next();
  }
};

const changeReportStatus = async (
  req: Request<{ report_id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      params: { report_id: reportId },
    } = req;

    await ReportService.changeReportStatus({ reportId: Number(reportId), input: {...req.body} });

    res.status(200).json({ status: "success" });
  } catch (error) {
    next();
  }
};

export { getAllReports, changeReportStatus };
