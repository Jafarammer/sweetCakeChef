const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo") {
    return cb(null, file.mimetype.startsWith("image/"));
  }

  if (file.fieldname === "videos") {
    return cb(null, file.mimetype.startsWith("video/"));
  }

  cb(new Error("Invalid file field"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 150 * 1024 * 1024,
  },
});

module.exports = upload;
