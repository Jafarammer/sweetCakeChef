import { Router } from "express";
import authController from "../controller/auth.controller.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import authToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", authToken, authController.getProfile);
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export default router;
