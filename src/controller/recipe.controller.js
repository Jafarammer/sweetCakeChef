import recipeService from "../service/recipe.service.js";
import { logging } from "../app/logging.js";

const addNewRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;

    await recipeService.createRecipe(req.body, req.files, userId);

    return res.status(201).json({
      success: true,
      message: "Create new recipe successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Internal server error",
    });
  }
};

const getAllRecipe = async (req, res, next) => {
  try {
    const result = await recipeService.getAllData({
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Recipes retrieved successfully",
      data: result.recipes,
      metaData: result.pagination,
    });
  } catch (error) {
    next();
  }
};

const recipeController = {
  addNewRecipe,
  getAllRecipe,
};

export default recipeController;
