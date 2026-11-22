import cloudinary from "../app/cloudinary.js";

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) {
    const error = new Error("files not found");
    error.statusCode = 404;
    throw error;
    return;
  }

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

export default deleteFromCloudinary;
