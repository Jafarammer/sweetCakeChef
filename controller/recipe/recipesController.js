const model = require("../../model/recipe/recipeModel");
const searchModel = require("../../model/recipe/searchRecipeModel");
const cloudinary = require("../../utils/cloudinary");

// ADD
const addRecipe = async (req, res) => {
  try {
    const { title_recipe, ingredients, user_id } = req.body;
    const uploadImages = req?.file
      ? await cloudinary.uploader.upload(req?.file?.path, { folder: "recipe" })
      : null;
    // const photo = req?.file ? uploadImages.secure_url : null;
    const getData = await model.addRecipeModel({
      title_recipe,
      ingredients,
      photo: {
        public_id: uploadImages.public_id,
        url: uploadImages.secure_url,
      },
      user_id,
    });
    if (getData) {
      res.status(200).send("Data added successfully");
    } else {
      res.status(400).send("Data failed to add");
    }
  } catch (error) {
    console.log(`Errornya disini nih ${error}`);
    res.status(400).send("Any error");
  }
};

// EDIT
const editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_recipe, ingredients, user_id } = req.body;
    const uploadImages = cloudinary.uploader.upload(req.file.path, {
      folder: "recipe",
    });
    const photo = uploadImages?.secure_url;
    const getData = await searchModel.recipeById(id);
    if (getData.rowCount > 0) {
      let titleInput = title_recipe || getData?.rows[0]?.title_recipe;
      let titleIngredients = ingredients || getData?.rows[0]?.ingredients;
      let inputImages = photo || getData?.rows[0]?.photo;
      let titleUserId = user_id || getData?.rows[0]?.user_id;

      const editData = await model.editRecipeModel({
        title_recipe: titleInput,
        ingredients: titleIngredients,
        photo: inputImages,
        user_id: titleUserId,
        id,
      });
      if (editData) {
        res.send("Data changed successfully");
      } else {
        res.send("Data failed to change");
      }
    } else {
      res.status(404).send("Data not found!");
    }
  } catch (error) {
    // console.log(`Hey errornya disini ${err}`);
    res.status(500).send("Any error");
  }
};

//   DELETE
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    // Check user by id
    const getData = await searchModel.recipeById(id);

    if (getData.rowCount > 0) {
      const delRecipe = await model.deleteRecipeModel(id);
      if (delRecipe) {
        res.send("Data deleted successfully");
      } else {
        res.status(400).send("Data failed to delete");
      }
    } else {
      res.status(404).send("Data not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Any error");
  }
};

module.exports = { addRecipe, editRecipe, deleteRecipe };
