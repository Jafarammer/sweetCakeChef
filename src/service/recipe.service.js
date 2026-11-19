import recipeRepository from "../repositories/recipe.repository.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const createRecipe = async (data, files, userId) => {
  let photoUrl = null;
  const videUrl = [];

  if (files?.photo?.[0]) {
    const photo = await uploadToCloudinary(files.photo[0], "recipe", "image");

    photoUrl = photo;
  }

  if (files?.videos?.length) {
    const uploadedVideos = await Promise.all(
      files.videos.map((file) => uploadToCloudinary(file, "recipe", "video")),
    );

    videUrl.push(...uploadedVideos.map((video) => video.url));
  }

  return recipeRepository.create({
    titleRecipe: data.titleRecipe,
    ingredients: data.ingredients,
    photo: photoUrl,
    videos: videUrl,
    userId,
  });
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

const recipeService = {
  createRecipe,
  getAllData,
  getMyRecipe,
};

export default recipeService;
