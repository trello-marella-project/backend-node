import * as express from "express";
import { userPermission } from "../middleware/permissions";
import {
  createBlock,
  deleteBlock,
  getWorkspaceById,
  updateBlock,
} from "../controllers/workspace.conntroller";

const router = express.Router();

router.get("/:workspace_id", userPermission, getWorkspaceById);
router.post("/:workspace_id/block", userPermission, createBlock);
router.put("/:workspace_id/block/:block_id", userPermission, updateBlock);
router.delete("/:workspace_id/block/:block_id", userPermission, deleteBlock);

export default router;
