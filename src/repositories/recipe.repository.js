import pool from "../app/db.js";
import recipeModel from "../model/recipe.model.js";
import recipeVideoModel from "../model/recipeVideo.model.js";
import databaseLogger from "../middleware/dbLogger.js";

const create = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const recipe = await databaseLogger(
      () => recipeModel.create(client, data),
      "Insert new recipe",
    );

    const videos = [];

    for (const videoUrl of data.videos) {
      const video = await databaseLogger(
        () =>
          recipeVideoModel.create(client, {
            recipeId: recipe.id_recipe,
            videoUrl: videoUrl,
          }),
        "Insert new video",
      );

      videos.push(video);
    }

    await client.query("COMMIT");

    return { ...recipe, videos };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findAll = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  const [recipes, total] = await Promise.all([
    databaseLogger(
      () => recipeModel.findAll({ limit, offset }),
      "Get all recipe",
    ),
    databaseLogger(() => recipeModel.countAll(), "Count all recipes"),
  ]);

  return {
    recipes,
    total,
  };
};

const findById = async (recipeId) => {
  const rows = await databaseLogger(
    () => recipeModel.findById(recipeId),
    "Get recipe detail",
  );

  if (rows.length === 0) {
    return null;
  }

  const firstRow = rows[0];

  const recipe = {
    id_recipe: firstRow.id_recipe,
    title_recipe: firstRow.title_recipe,
    ingredients: firstRow.ingredients,
    photo: firstRow.photo,
    user: {
      id: firstRow.user_id,
      name: firstRow.user_name,
      photo: firstRow.user_photo,
    },
    videos: [],
  };

  for (const row of rows) {
    if (row.video_id) {
      recipe.videos.push({
        id: row.video_id,
        video_url: row.video_url,
      });
    }
  }

  return recipe;
};

const findMyRecipe = async (userId, { page, limit }) => {
  const offset = (page - 1) * limit;
  const [recipes, total] = await Promise.all([
    databaseLogger(
      () => recipeModel.findMyRecipe(userId, { limit, offset }),
      "Get my recipe",
    ),
    databaseLogger(() => recipeModel.countMyRecipe(userId), "Count my recipe"),
  ]);

  return {
    recipes,
    total,
  };
};

const updateRecipe = async ({ recipeId, userId, body, photo, videos }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingRecipe = await databaseLogger(
      () => recipeModel.findByIdAndUser(client, recipeId, userId),
      "Find recipe by user",
    );

    if (!existingRecipe) {
      const error = new Error("Recipe not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedRecipe = await databaseLogger(
      () =>
        recipeModel.update(client, recipeId, {
          ...body,
          ...(photo ? { photo: photo.url } : {}),
        }),
      "Update recipe",
    );

    let updatedVideos = null;

    if (videos.length > 0) {
      await databaseLogger(
        () => recipeVideoModel.deleteByRecipeId(client, recipeId),
        "Delete video for update recipe",
      );

      updatedVideos = [];

      for (const video of videos) {
        const result = await databaseLogger(
          () =>
            recipeVideoModel.create(client, { recipeId, videoUrl: video.url }),
          "Update video",
        );

        updatedVideos.push(result);
      }
    }

    await client.query("COMMIT");

    return {
      ...updateRecipe,
      videos: updatedVideos,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default {
  create,
  findAll,
  findMyRecipe,
  findById,
  updateRecipe,
};
