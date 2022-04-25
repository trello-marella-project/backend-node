import * as express from "express";
import { userPermission } from "../middleware/permissions";
import { checkEmailExistence } from "../controllers/user.controller";

const router = express.Router();

router.post("/email", userPermission, checkEmailExistence);

export default router;
