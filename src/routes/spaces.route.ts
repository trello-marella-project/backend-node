import * as express from "express";
import { userPermission } from "../middleware/permissions";
import {
  createSpace,
  getAllTags,
  getPermittedSpaces,
  getRecentSpaces,
  getYoursSpaces,
  updateSpace,
} from "../controllers/spaces.controller";
import { createSpaceSchema } from "../schema/space.schema";
import validateResource from "../middleware/validate-resource";

const router = express.Router();

router.post(
  "/",
  validateResource(createSpaceSchema),
  userPermission,
  createSpace
);

router.put("/:space_id", userPermission, updateSpace);

router.get("/yours", userPermission, getYoursSpaces);
router.get("/permitted", userPermission, getPermittedSpaces);
router.get("/recent", userPermission, getRecentSpaces);

router.get("/tags", userPermission, getAllTags);

export default router;
