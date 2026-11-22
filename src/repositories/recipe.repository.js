import pool from "../app/db.js";
import recipeModel from "../model/recipe.model.js";
import recipeVideoModel from "../model/recipeVideo.model.js";
import databaseLogger from "../middleware/dbLogger.js";

const create = async (userId, payload) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const recipe = await databaseLogger(
      () =>
        recipeModel.create(client, userId, {
          titleRecipe: payload.titleRecipe,
          ingredients: payload.ingredients,
          photoUrl: payload.photo?.url,
          photoId: payload.photo?.publicId,
        }),
      "Insert new recipe",
    );

    const videos = [];

    for (const video of payload.videos) {
      const result = await databaseLogger(
        () =>
          recipeVideoModel.create(client, {
            recipeId: recipe.id_recipe,
            videoUrl: video.url,
            videoId: video.publicId,
          }),
        "Insert new video",
      );

      videos.push(result);
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

const updateRecipe = async (recipeId, userId, payload) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // validasi recipe id nya ada atau tidak , atau id nya benar atau tidak milik user tsb.
    const existingRecipe = await databaseLogger(
      () => recipeModel.findByIdAndUser(client, recipeId, userId, true),
      "Find recipe by user",
    );

    if (!existingRecipe) {
      const error = new Error("Recipe not found");
      error.statusCode = 404;
      throw error;
    }

    // ini adalah variable untuk menampung id file yg di delete dari db, photo atau video.
    const oldFiles = [];

    // validasi video ada yg di update atau yg didelete, jika tidak ada harusnya proses ini tidak di teruskan.
    if (payload.videos.length > 0 || payload.deletedVideoIds.length > 0) {
      // ambil semua video dari user tsb.
      const existingVideos = await databaseLogger(
        () => recipeVideoModel.findByRecipeId(client, recipeId),
        "Find video by recipe id",
      );

      // reset atau set kembali data id yg akan didelete.
      const deletedIds = [...new Set(payload.deletedVideoIds.map(String))];

      // ambil id video yg akan di delete
      const videosToDelete = existingVideos.filter((video) =>
        deletedIds.includes(String(video.id)),
      );
      // tampilkan error ketika id dari video yg akan di delete tidak sama dengan video yg di db
      if (videosToDelete.length !== deletedIds.length) {
        const error = new Error(
          "One or more videos do not belong to this recipe",
        );
        error.statusCode = 400;
        throw error;
      }

      // Menghitung jumlah video yang tersisa setelah video lama dihapus
      const remainingVideos = existingVideos.length - videosToDelete.length;
      // Menghitung jumlah video yang tersisa setelah video lama dihapus
      const totalVideos = remainingVideos + payload.videos.length;

      // validasi total video
      if (totalVideos < 1 || totalVideos > 3) {
        const error = new Error("A recipe must have between 1 and 3 videos");
        error.statusCode = 400;
        throw error;
      }
      // simpan id yg di delete ke variable oldFiles
      videosToDelete.forEach((video) => {
        if (video.video_public_id) {
          oldFiles.push({
            publicId: video.video_public_id,
            resourceType: "video",
          });
        }
      });

      // validasi jika mau update video, delete dlu video lamanya di db sebelum di update data baru agar tidak penuh dbnya
      if (videosToDelete.length > 0) {
        await databaseLogger(
          () =>
            recipeVideoModel.deleteForUpdateRecipe(
              client,
              recipeId,
              videosToDelete.map((video) => video.id),
            ),
          "Delete the video for update recipe",
        );
      }
      // lakukan create video baru
      for (const video of payload.videos) {
        await databaseLogger(
          () =>
            recipeVideoModel.create(client, {
              recipeId,
              videoUrl: video.url,
              videoId: video.publicId,
            }),
          "Update video",
        );
      }
    }

    // validasi untuk update photo, jika photo tidak di update harusny proses ini di lewati
    if (payload.photo && existingRecipe.photo_public_id) {
      oldFiles.push({
        publicId: existingRecipe.photo_public_id,
        resourceType: "image",
      });
    }

    // update database recipenya
    const update = await databaseLogger(
      () =>
        recipeModel.update(client, recipeId, userId, {
          titleRecipe: payload.titleRecipe,
          ingredients: payload.ingredients,
          photoUrl: payload.photo?.url,
          photoId: payload.photo?.publicId,
        }),
      "Update recipe",
    );
    // ambil data video yg baru base on recipe_id bukan id dari video tetapi id dari recipenya, karna ada dua db recipe dan recipe video
    const updatedVideos = await databaseLogger(
      () => recipeVideoModel.findByRecipeId(client, recipeId),
      "Take list new video",
    );

    await client.query("COMMIT");

    return {
      ...update,
      videos: updatedVideos,
      oldFiles: oldFiles,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteRecipe = async (recipeId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingRecipe = await databaseLogger(
      () => recipeModel.findByIdAndUser(client, recipeId, userId, true),
      "Find recipe by user",
    );

    if (!existingRecipe) {
      const error = new Error("Recipe not found");
      error.statusCode = 404;
      throw error;
    }

    const existingVideos = await databaseLogger(
      () => recipeVideoModel.findByRecipeId(client, recipeId),
      "Find video by recipe id",
    );

    const oldFiles = [];

    if (existingRecipe.photo_public_id) {
      oldFiles.push({
        publicId: existingRecipe.photo_public_id,
        resourceType: "image",
      });
    }

    existingVideos.forEach((video) => {
      if (video.video_public_id) {
        oldFiles.push({
          publicId: video.video_public_id,
          resourceType: "video",
        });
      }
    });

    await databaseLogger(
      () => recipeVideoModel.deleteByRecipeId(client, recipeId),
      "Delete video by recipe id",
    );

    const deleteRecipe = databaseLogger(
      () => recipeModel.deleteByIdAndUser(client, recipeId, userId),
      "Delete recipe by id",
    );

    await client.query("COMMIT");

    return {
      recipe: deleteRecipe,
      oldFiles: oldFiles,
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
  deleteRecipe,
};
