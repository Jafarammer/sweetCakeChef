const multerUtils = require("../multer");
const multer = require("multer");

const uploadImage = (req, res, next) => {
  const uploadImage = multerUtils.single("image");

  uploadImage(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(400).send(err?.message ?? "Something went wrong!");
        return;
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(400).send(err ?? "Something went wrong!");
        return;
      }

      next();
    } catch (error) {
      res.status(500).send(error?.message ?? "Upload Failed");
    }
  });
};

module.exports = { uploadImage };
