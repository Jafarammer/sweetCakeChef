const Router = require("express").Router();
const controller = require("../../controller/recipe/searchRecipeController");

// All data
Router.get("/recipe", controller.findAllRecipe);
// Find Page
Router.get("/recipe/page", controller.findPageRecipe);
// Find name
Router.get("/recipe/name", controller.findRecipeName);
// Find id
Router.get("/recipe/id/:id", controller.findRecipeId);
// Find user id
Router.get("recipe/recipebyuser/:id", controller.findRecipeUser);
// find user id tes
Router.get("recipe/recipe/userId", controller.findRecipeUserId);

module.exports = Router;
