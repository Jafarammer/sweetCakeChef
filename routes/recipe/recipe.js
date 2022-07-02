const Router = require("express").Router();
const controllerRecipe = require("../../controller/recipe/recipeController");
const uploadMiddleware = require("../../middleware/uploadImages");

// GET
Router.get("/recipe", controllerRecipe.getAllRecipe);

// FIND NAME
Router.get("/recipe/find", controllerRecipe.getFindRecipe);
// POST

Router.post(
  "/recipe/add",
  uploadMiddleware.uploadImage,
  controllerRecipe.addRecipe
);

// Edit
Router.patch(
  "/recipe/edit",
  uploadMiddleware.uploadImage,
  controllerRecipe.editRecipe
);

// DELETE
Router.delete("/recipe/delete", controllerRecipe.deleteRecipe);

// SHOW 5 NEW DATA RECIPE
// Router.get("/new", (req, res) => {
//   db.query(
//     "SELECT * FROM recipe ORDER BY id_recipe DESC LIMIT 5",
//     (err, result) => {
//       if (err) {
//         res.status(500).send("Internal server error");
//       } else {
//         res.send({
//           data: result.rows,
//           totalData: result.rowCount,
//         });
//       }
//     }
//   );
// });

module.exports = Router;
