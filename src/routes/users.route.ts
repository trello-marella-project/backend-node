import * as express from "express";
import { adminPermission, userPermission } from "../middleware/permissions";
import {
  getAllUsers,
  checkEmailExistence,
} from "../controllers/users.controller";

const router = express.Router();

router.get("/", adminPermission, getAllUsers);
router.post("/email", userPermission, checkEmailExistence);

export default router;
