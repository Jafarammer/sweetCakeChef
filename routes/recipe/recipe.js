const Router = require("express").Router();
const multer = require("multer");
const path = require("path");
const controllerRecipe = require("../../controller/recipe/recipeController");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}` + path.extname(file.originalname));
    //path.extname get the uploaded file extension
  },
});
const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    // upload only png and jpg format
    return cb("Please upload a Image");
  }
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("image_recipe");

// GET
Router.get("/recipe", controllerRecipe.getAllRecipe);

// FIND NAME
Router.get("/recipe/find", controllerRecipe.getFindRecipe);
// POST

Router.post("/recipe/add", upload, controllerRecipe.addRecipe);

// Edit
Router.patch("/recipe/edit", upload, controllerRecipe.editRecipe);

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
