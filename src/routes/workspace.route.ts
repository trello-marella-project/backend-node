import * as express from "express";
import { userPermission } from "../middleware/permissions";
import {
  createBlock,
  deleteBlock,
  getWorkspaceById,
  updateBlock,
  deleteCard,
  updateCard,
  createCard,
} from "../controllers/workspace.conntroller";
import validateResource from "../middleware/validate-resource";
import {
  workspaceBlockSchema,
  workspaceCardSchema,
} from "../schema/workspace.schema";

const router = express.Router();

router.get("/:workspace_id", userPermission, getWorkspaceById);

router.post(
  "/:workspace_id/block",
  userPermission,
  validateResource(workspaceBlockSchema),
  createBlock
);
router.put(
  "/:workspace_id/block/:block_id",
  userPermission,
  validateResource(workspaceBlockSchema),
  updateBlock
);
router.delete("/:workspace_id/block/:block_id", userPermission, deleteBlock);

router.post(
  "/:workspace_id/block/:block_id/card",
  userPermission,
  validateResource(workspaceCardSchema),
  createCard
);
router.put(
  "/:workspace_id/block/:block_id/card/:card_id",
  userPermission,
  validateResource(workspaceCardSchema),
  updateCard
);
router.delete(
  "/:workspace_id/block/:block_id/card/:card_id",
  userPermission,
  deleteCard
);

export default router;
