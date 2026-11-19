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

const recipeService = {
  createRecipe,
};

export default recipeService;
