const Router = require("express").Router();
const controller = require("../../controller/recipe/searchRecipeController");

// All data
Router.get("/", controller.findAllRecipe);
// Find name
Router.get("/name", controller.findRecipeName);
// Find id
Router.get("/id/:id", controller.findRecipeId);
// Find user id
Router.get("/recipebyuser", controller.findRecipeUser);

module.exports = Router;
