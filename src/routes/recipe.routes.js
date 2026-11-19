import { Router } from "express";
import recipeController from "../controller/recipe.controller.js";
import validate from "../middleware/validate.js";
import { createRecipeSchema } from "../validations/recipe.validation.js";
import authToken from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.post(
  "/create",
  authToken,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "videos", maxCount: 3 },
  ]),
  validate(createRecipeSchema),
  recipeController.addNewRecipe,
);

export default router;
