import * as express from "express";
import { userPermission } from "../middleware/permissions";
import { getWorkspaceById } from "../controllers/workspace.conntroller";

const router = express.Router();

router.get("/:workspace_id", userPermission, getWorkspaceById);

export default router;
