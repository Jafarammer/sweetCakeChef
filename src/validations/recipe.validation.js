import { z } from "zod";

export const createRecipeSchema = z.object({
  titleRecipe: z
    .string()
    .trim()
    .min(3, "Recipe title must be at least 3 characters")
    .max(255, "Recipe title must not exceed 255 characters"),

  ingredients: z.string().trim().min(1, "Ingredients are required"),
});
