const Router = require("express").Router();
const uploadMiddleware = require("../../middleware/uploadImages");
const validateToken = require("../../middleware/verifyToken");
const controller = require("../../controller/recipe/recipesController");

// Router.get("/recipe", validateToken.checkToken, controllerRecipe.getAllRecipe); ony example using token

// ADD
Router.post("recipe/add", uploadMiddleware.uploadSingle, controller.addRecipe);
// EDIT
Router.patch(
  "recipe/edit/:id",
  uploadMiddleware.uploadSingle,
  controller.editRecipe
);
// DELETE
Router.delete("recipe/delete/:id", controller.deleteRecipe);

module.exports = Router;
