const Router = require("express").Router();
const controller = require("../../controller/recipe/searchRecipeController");

// All data not asc or desc
Router.get("/all", controller.findShowAllRecipe);
// All data desc
Router.get("/", controller.findAllRecipe);
// Find Page
Router.get("/page", controller.findPageRecipe);
// Find name
Router.get("/name", controller.findRecipeName);
// Find id
Router.get("/id/:id", controller.findRecipeId);
// Find user id
Router.get("/recipebyuser/:id", controller.findRecipeUser);
// find user id tes
Router.get("/recipe/userId", controller.findRecipeUserId);
// sorting
Router.get("/recipe/sort", controller.sortRecipe);

module.exports = Router;
