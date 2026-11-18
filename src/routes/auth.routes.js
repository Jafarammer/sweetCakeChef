import { Router } from "express";
import authController from "../controller/auth.controller.js";
import validate from "../middleware/validate.js";
import { registerSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

export default router;
