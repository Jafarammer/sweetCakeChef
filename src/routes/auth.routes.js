import { Router } from "express";
import authController from "../controller/auth.controller.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import authToken from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/profile", authToken, authController.getProfile);
router.patch("/profile", authToken, authController.updatePersonalInformation);

export default router;
