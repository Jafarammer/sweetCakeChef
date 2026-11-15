const Router = require("express").Router();
const uploadMiddleware = require("../../middleware/uploadImages");
const upload = require("../../middleware/upload");
const validateToken = require("../../middleware/verifyToken");
const controller = require("../../controller/recipe/recipesController");

// Router.get("/recipe", validateToken.checkToken, controllerRecipe.getAllRecipe); ony example using token

// ADD
Router.post(
  "/add",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "videos",
      maxCount: 3,
    },
  ]),
  controller.addRecipe,
);
// EDIT
Router.patch("/edit/:id", uploadMiddleware.uploadSingle, controller.editRecipe);
// DELETE
Router.delete("/delete/:id", controller.deleteRecipe);

module.exports = Router;
