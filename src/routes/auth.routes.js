import { Router } from "express";
import authController from "../controller/auth.controller.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export default router;
