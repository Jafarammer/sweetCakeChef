import recipeRepository from "../repositories/recipe.repository.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import { logging } from "../app/logging.js";
import isValidUUID from "../utils/isValidUuid.js";
import { NODE_ENV } from "../utils/env.js";

const createRecipe = async (body, files, userId) => {
  const uploadedFiles = [];

  try {
    const hashTextResult =
      body.titleRecipe !== undefined || body.ingredients !== undefined;

    const photo = files.photo?.[0];
    const videos = files?.videos || [];

    if (!hashTextResult || !photo || videos.length === 0) {
      const error = new Error("No data provided for create");
      error.statusCode = 400;
      throw error;
    }

    const photoResult = await uploadToCloudinary(photo, "recipe", "image");

    uploadedFiles.push({
      publicId: photoResult.publicId,
      resourceType: "image",
    });

    const videoResult = [];

    for (const video of videos) {
      const result = await uploadToCloudinary(video, "recipe", "video");

      uploadedFiles.push({
        publicId: result.publicId,
        resourceType: "video",
      });

      videoResult.push({
        url: result.url,
        publicId: result.publicId,
      });
    }

    const payload = {
      titleRecipe: body.titleRecipe,
      ingredients: body.ingredients,
      photo: photoResult,
      videos: videoResult,
    };

    return recipeRepository.create(userId, payload);
  } catch (error) {
    await Promise.allSettled(
      uploadedFiles.map((file) =>
        deleteFromCloudinary(file.publicId, file.resourceType),
      ),
    );

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
  // variable untuk menampung id photo atau video yg baru, jika proses gagal save ke db lakukan juga destroy file di cloudinary
  const uploadedFiles = [];

  try {
    const photo = files?.photo?.[0];
    const videos = files?.videos || [];
    const hashTextUpdate =
      body.titleRecipe !== undefined || body.ingredients !== undefined;
    // variable penampung untuk new photo
    let photoResult = null;
    // variable penampung untuk new video
    const videoResult = [];
    // variable penampung id video yg di delete atau yang akan di update
    let deletedVideoIds = JSON.parse(body.deletedVideoIds || "[]");

    // validasi id video yg di delete harus int jika prod uuid
    if (
      !Array.isArray(deletedVideoIds) ||
      !deletedVideoIds.every((id) =>
        NODE_ENV === "development"
          ? Number.isInteger(Number(id)) && Number(id) > 0
          : isValidUUID(id),
      )
    ) {
      const error = new Error("Invalid deleted id format");
      error.statusCode = 400;
      throw error;
    }

    // validasi input field
    if (
      !hashTextUpdate &&
      !photo &&
      !videos.length === 0 &&
      deletedVideoIds.length === 0
    ) {
      const error = new Error("No data provided for update");
      error.statusCode = 400;
      throw error;
    }

    // validasi update photo
    if (photo) {
      photoResult = await uploadToCloudinary(photo, "recipe", "image");
      uploadedFiles.push({
        publicId: photoResult.publicId,
        resourceType: "image",
      });
    }

    // validasi update video
    if (videos.length > 0) {
      for (const video of videos) {
        const result = await uploadToCloudinary(video, "recipe", "video");
        uploadedFiles.push({
          publicId: result.publicId,
          resourceType: "video",
        });
        videoResult.push({
          url: result.url,
          publicId: result.publicId,
        });
      }
    }

    const payload = {
      titleRecipe: body.titleRecipe,
      ingredients: body.ingredients,
      photo: photoResult,
      videos: videoResult,
      deletedVideoIds: deletedVideoIds,
    };

    const result = await recipeRepository.updateRecipe(
      recipeId,
      userId,
      payload,
    );

    // variable ini adalah berisi id file yg di hapus dari db , id yg disini juga yg akan di gunakan untuk proses destroy ke cloudinary
    const oldFiles = result.oldFiles || [];

    const cleanUpResult = await Promise.allSettled(
      oldFiles.map((file) =>
        deleteFromCloudinary(file.publicId, file.resourceType),
      ),
    );

    /**
     * validasi ini adalah untuk melihat log ketika proses destry gagal ke cloudinary, akan tetai validasi ini masih perlu pengembangan, yaitu ,
     * 1. pembuatan table baru untuk menampung id yg gagal
     * 2. buatkan fungsi delete ketika prosesnya berhasil di destry sekalin bawa id id yg gagal yang di save di db
     */
    cleanUpResult.forEach((cleanUp, index) => {
      if (cleanUp.status === "rejected") {
        logging.warn(
          `[Cloudinary] -- Cloudinary cleanup failed: (Old Files) ${oldFiles[index].publicId} | (Reason) ${cleanUp.reason}`,
        );
      }
    });

    return result;
  } catch (error) {
    // validasi ketika terjadi error pada saat proses save to db dan ada file yg sudah terupload ke cloudinary, jadi fungsi ini untuk menghapus id id tersebut dari cloudinary
    await Promise.allSettled(
      uploadedFiles.map((file) =>
        deleteFromCloudinary(file.publicId, file.resourceType),
      ),
    );

    throw error;
  }
};

const deleteRecipe = async (recipeId, userId) => {
  const result = await recipeRepository.deleteRecipe(recipeId, userId);

  const oldFiles = result.oldFiles || [];

  const cleanUpResult = await Promise.allSettled(
    oldFiles.map((file) =>
      deleteFromCloudinary(file.publicId, file.resourceType),
    ),
  );

  cleanUpResult.forEach((cleanUp, index) => {
    if (cleanUp.status === "rejected") {
      logging.warn(
        `[Cloudinary] -- Cloudinary cleanup failed: (Old Files) ${oldFiles[index].publicId} | (Reason) ${cleanUp.reason}`,
      );
    }
  });

  return result.recipe;
};

const recipeService = {
  createRecipe,
  getAllData,
  getMyRecipe,
  getDetailRecipe,
  updateRecipe,
  deleteRecipe,
};

export default recipeService;
