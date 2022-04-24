import * as express from "express";
import { register } from "../controllers/auth.controller";
import validateResource from "../middleware/validate-resource";
import { registerUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("/register", validateResource(registerUserSchema), register);

export default router;
