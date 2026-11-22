import recipeService from "../service/recipe.service.js";
import { logging } from "../app/logging.js";

const addNewRecipe = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await recipeService.createRecipe(req.body, req.files, userId);

    return res.status(201).json({
      success: true,
      message: "Create new recipe successfully",
    });
  } catch (error) {
    next(error);
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
    next(error);
  }
};

const getMyRecipe = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await recipeService.getMyRecipe(userId, {
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "My recipes retrieved successfully",
      data: result.recipes,
      metaData: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailRecipe = async (req, res, next) => {
  try {
    const result = await recipeService.getDetailRecipe(req.params.id);

    return res.status(200).json({
      succcess: true,
      message: "Detail recipes retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.userId;

    await recipeService.updateRecipe(req.body, req.files, recipeId, userId);

    return res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await recipeService.deleteRecipe(id, userId);

    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const recipeController = {
  addNewRecipe,
  getAllRecipe,
  getMyRecipe,
  getDetailRecipe,
  updateRecipe,
  deleteRecipe,
};

export default recipeController;
