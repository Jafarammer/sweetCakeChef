const recipeModel = require("../../model/recipeModel");

// ALL RECIPE
const getAllRecipe = async (req, res) => {
  try {
    const getData = await recipeModel.recipeAllModel();
    res.send({
      data: getData.rows?.map((item) => ({
        ...item,
        ...{ photo: `http://localhost:8000/${item.photo}` },
      })),
      totalData: getData.rowCount,
    });
  } catch (err) {
    console.log(`Errornya niih ${err}`);
    res.status(400).send("Internal server error");
  }
};

// FIND BY NAME
const getFindRecipe = async (req, res) => {
  try {
    const { title_recipe } = req.body;
    const getData = await recipeModel.recipeByname(title_recipe);
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (err) {
    console.log(`Errornya disini ${err}`);
    res.status(400).send("Internal server error");
  }
};

// ADD
const addRecipe = async (req, res) => {
  try {
    const { title_recipe, ingredients } = req.body;
    const addUser = await recipeModel.addRecipeModel({
      title_recipe,
      ingredients,
      photo: req.file?.path,
      // image_recipe: req.file?.path,
    });

    if (addUser) {
      res.status(200).send("Data added successfully");
    } else {
      res.status(400).send("Data failed to add");
    }
  } catch (error) {
    console.log(`Errornya disini nih ${error}`);
    res.status(400).send("Internal server error");
  }
};

// EDIT
const editRecipe = async (req, res) => {
  try {
    const { title_recipe, ingredients, id_recipe } = req.body;
    const image_recipe = req.file.filename;
    const getData = await recipeModel.recipeById(id_recipe);
    if (getData.rowCount > 0) {
      let titleInput = title_recipe || getData?.rows[0]?.title_recipe;
      let titleIngredients = ingredients || getData?.rows[0]?.ingredients;
      let titleImage = image_recipe || getData?.rows[0]?.image_recipe;

      const editData = await recipeModel.editRecipeModel({
        title_recipe: titleInput,
        ingredients: titleIngredients,
        image_recipe: titleImage,
        id_recipe,
      });
      if (editData) {
        res.send("Data changed successfully");
      } else {
        res.send("Data failed to change");
      }
    } else {
      res.status(404).send("Data not found!");
    }
  } catch (err) {
    console.log(`Hey errornya disini ${err}`);
    res.status(500).send("Internal server error");
  }
};

// DELETE
const deleteRecipe = async (req, res) => {
  try {
    const { id_recipe } = req.body;

    // Check user by id
    const getData = await recipeModel.recipeById(id_recipe);

    if (getData.rowCount > 0) {
      const delRecipe = await recipeModel.deleteRecipeModel(id_recipe);

      if (delRecipe) {
        res.send("Data deleted successfully");
      } else {
        res.status(400).send("Data failed to delete");
      }
    } else {
      res.status(404).send("Data not found");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getAllRecipe,
  getFindRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  // upload
};
