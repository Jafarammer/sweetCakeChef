import cloudinary from "../app/cloudinary.js";

const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    const fileBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    uploadStream.end(fileBuffer);
  });
};

export default uploadToCloudinary;
