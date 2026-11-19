import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 4,
  },
  fileFilter: (_req, file, callback) => {
    if (file.fieldname === "photo") {
      if (!file.mimetype.startsWith("image/")) {
        return callback(new Error("Photo must be an image"));
      }
    } else if (file.fieldname === "videos") {
      if (!file.mimetype.startsWith("video/")) {
        return callback(new Error("Videos must be video files"));
      }
    } else {
      return callback(new Error("Unexpected file field"));
    }

    callback(null, true);
  },
});

export default upload;
