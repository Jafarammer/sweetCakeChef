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
    next();
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
    next();
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.userId;
    const photo = req.files?.photo?.[0] || null;
    const videos = req.files?.videos || [];

    const result = await recipeService.updateRecipe({
      recipeId,
      userId,
      body: req.body,
      photo,
      videos,
    });

    return res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: result,
    });
  } catch (error) {
    console.log("this", error);

    next();
  }
};

const recipeController = {
  addNewRecipe,
  getAllRecipe,
  getMyRecipe,
  getDetailRecipe,
  updateRecipe,
};

export default recipeController;
