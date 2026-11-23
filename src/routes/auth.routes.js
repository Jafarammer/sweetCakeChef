import { Router } from "express";
import authController from "../controller/auth.controller.js";
import validate from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  updatePersonalInformationSchema,
  updateSecuritySchema,
} from "../validations/auth.validation.js";
import authToken from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/profile", authToken, authController.getProfile);
router.patch(
  "/profile",
  authToken,
  validate(updatePersonalInformationSchema),
  authController.updatePersonalInformation,
);
router.patch(
  "/profile/change-password",
  authToken,
  validate(updateSecuritySchema),
  authController.updateSecurity,
);

router.patch(
  "/profile/photo-profile",
  authToken,
  upload.fields([{ name: "photo", maxCount: 1 }, ,]),
  authController.updatePhotoProfile,
);

export default router;
