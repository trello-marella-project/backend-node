import * as express from "express";
import { userPermission } from "../middleware/permissions";
import {
  createBlock,
  getWorkspaceById,
} from "../controllers/workspace.conntroller";

const router = express.Router();

router.get("/:workspace_id", userPermission, getWorkspaceById);
router.post("/:workspace_id/block", userPermission, createBlock);

export default router;
