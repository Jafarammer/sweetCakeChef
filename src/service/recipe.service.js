import recipeRepository from "../repositories/recipe.repository.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const createRecipe = async (body, files, userId) => {
  try {
    const hashTextResult =
      body.titleRecipe !== undefined || body.ingredients !== undefined;

    const photo = files.photo[0];
    const videos = files.videos;

    if (!hashTextResult || !photo || videos.length === 0) {
      const error = new Error("No data provided for create");
      error.statusCode = 400;
      throw error;
    }

    const photoResult = await uploadToCloudinary(photo, "recipe", "image");

    const videoResult = [];

    const uploadedVideos = await Promise.all(
      files.videos.map((file) => uploadToCloudinary(file, "recipe", "video")),
    );

    videoResult.push(
      ...uploadedVideos.map((video) => ({
        url: video.url,
        publicId: video.publicId,
      })),
    );

    const payload = {
      titleRecipe: body.titleRecipe,
      ingredients: body.ingredients,
      photo: {
        url: photoResult.url,
        publicId: photoResult.publicId,
      },
      videos: videoResult,
    };

    return recipeRepository.create(userId, payload);
  } catch (error) {
    throw error;
  }
};

const getAllData = async ({ page = 1, limit = 10 }) => {
  const currentPage = Number(page);
  const perPage = Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    !Number.isInteger(perPage) ||
    currentPage < 1 ||
    perPage < 1 ||
    perPage > 100
  ) {
    const error = new Error("Invalid pagination parameters");
    error.statusCode = 400;
    throw error;
  }

  const { recipes, total } = await recipeRepository.findAll({
    page: currentPage,
    limit: perPage,
  });

  return {
    recipes,
    pagination: {
      currentPage,
      perPage,
      totalData: total,
      totalPage: Math.ceil(total / perPage),
      nextPage: currentPage * perPage < total,
      prevPage: currentPage > 1,
    },
  };
};

const getMyRecipe = async (userId, { page = 1, limit = 10 }) => {
  const currentPage = Number(page);
  const perPage = Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    !Number.isInteger(perPage) ||
    currentPage < 1 ||
    perPage < 1 ||
    perPage > 100
  ) {
    const error = new Error("Invalid pagination parameters");
    error.statusCode = 400;
    throw error;
  }

  const { recipes, total } = await recipeRepository.findMyRecipe(userId, {
    page: currentPage,
    limit: perPage,
  });

  return {
    recipes,
    pagination: {
      currentPage,
      perPage,
      totalData: total,
      totalPage: Math.ceil(total / perPage),
      nextPage: currentPage * perPage < total,
      prevPage: currentPage > 1,
    },
  };
};

const getDetailRecipe = async (recipeId) => {
  const recipe = await recipeRepository.findById(recipeId);

  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return recipe;
};

const updateRecipe = async (body, files, recipeId, userId) => {
  try {
    const hashTextUpdate =
      body.titleRecipe !== undefined || body.ingredients !== undefined;

    const photo = files.photo[0];
    const videos = files.videos;

    if (!hashTextUpdate || !photo || videos.length === 0) {
      const error = new Error("No data provided for update");
      error.statusCode = 400;
      throw error;
    }

    const photoResult = await uploadToCloudinary(photo, "recipe", "image");
    const videoResult = [];

    const uploadedVideos = await Promise.all(
      videos.map((file) => uploadToCloudinary(file, "recipe", "video")),
    );

    videoResult.push(...uploadedVideos.map((video) => video.url));

    const payload = {
      titleRecipe: body.titleRecipe,
      ingredients: body.ingredients,
      photo: photoResult.url,
      videos: videoResult,
    };

    return await recipeRepository.updateRecipe(recipeId, userId, payload);
  } catch (error) {
    throw error;
  }
};

const recipeService = {
  createRecipe,
  getAllData,
  getMyRecipe,
  getDetailRecipe,
  updateRecipe,
};

export default recipeService;
