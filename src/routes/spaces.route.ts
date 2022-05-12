import * as express from "express";
import { userPermission } from "../middleware/permissions";
import { createSpace } from "../controllers/spaces.controller";

const router = express.Router();

router.post("/", userPermission, createSpace);

export default router;
