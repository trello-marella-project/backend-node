import * as express from "express";
import {
  activateUser,
  login,
  refresh,
  register,
} from "../controllers/auth.controller";
import validateResource from "../middleware/validate-resource";
import { loginUserSchema, registerUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("/register", validateResource(registerUserSchema), register);
router.post("/login", validateResource(loginUserSchema), login);
router.get("/activate/:link", activateUser);
router.get("/refresh", refresh);

export default router;
