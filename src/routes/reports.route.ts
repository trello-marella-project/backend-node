import * as express from "express";
import { adminPermission, userPermission } from "../middleware/permissions";
import {
  changeReportStatus,
  getAllReports,
} from "../controllers/reports.controller";

const router = express.Router();

// router.get('/', adminPermission)
router.get("/", userPermission, getAllReports);

// router.post('/:report_id', adminPermission)
router.post("/:report_id", userPermission, changeReportStatus);
export default router;
