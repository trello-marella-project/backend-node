import * as express from "express";
import { adminPermission, userPermission } from "../middleware/permissions";
import {
  getAllUsers,
  checkEmailExistence,
} from "../controllers/users.controller";
import validateResource from "../middleware/validate-resource";
import { checkUserEmailSchema } from "../schema/user.schema";

const router = express.Router();

// router.get("/", adminPermission, getAllUsers);
router.get("/", userPermission, getAllUsers);
router.post(
  "/email",
  validateResource(checkUserEmailSchema),
  userPermission,
  checkEmailExistence
);

export default router;
