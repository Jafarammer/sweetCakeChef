import { Router } from "express";
import recipeController from "../controller/recipe.controller.js";
import validate from "../middleware/validate.js";
import {
  createRecipeSchema,
  updateRecipeSchema,
} from "../validations/recipe.validation.js";
import authToken from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", authToken, recipeController.getAllRecipe);
router.get("/detail/:id", authToken, recipeController.getDetailRecipe);
router.get("/my-recipe", authToken, recipeController.getMyRecipe);

router.patch(
  "/update/:id",
  authToken,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "videos", maxCount: 3 },
  ]),
  validate(updateRecipeSchema),
  recipeController.updateRecipe,
);

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

router.delete("/delete/:id", authToken, recipeController.deleteRecipe);

export default router;
