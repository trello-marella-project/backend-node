import * as express from "express";
import { activateUser, register } from "../controllers/auth.controller";
import validateResource from "../middleware/validate-resource";
import { registerUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("/register", validateResource(registerUserSchema), register);
router.get("/activate/:link", activateUser);

export default router;
