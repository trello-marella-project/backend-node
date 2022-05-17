import * as express from "express";
import { userPermission } from "../middleware/permissions";
import { createSpace, updateSpace } from "../controllers/spaces.controller";
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

// router.get("/yours", userPermission);

export default router;
