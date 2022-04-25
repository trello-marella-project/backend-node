import * as express from "express";
import { adminPermission } from "../middleware/permissions";
import { getAllUsers } from "../controllers/users.controller";

const router = express.Router();

router.get("/", adminPermission, getAllUsers);

export default router;
