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

const findAll = async () => {
  return await databaseLogger(() => recipeModel.findAll(), "Find all recipe");
};

export default {
  create,
  findAll,
};
