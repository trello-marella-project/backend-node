import * as express from "express";
import { userPermission } from "../middleware/permissions";
import { createSpace } from "../controllers/spaces.controller";
import { createSpaceSchema } from "../schema/space.schema";
import validateResource from "../middleware/validate-resource";

const router = express.Router();

router.post(
  "/",
  validateResource(createSpaceSchema),
  userPermission,
  createSpace
);

export default router;
