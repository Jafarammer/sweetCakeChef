const multerUtils = require("../utils/multerRecipe");
const multer = require("multer");
const { unlinkSync } = require("fs");

// single upload
const uploadSingle = (req, res, next) => {
  const uploadSingle = multerUtils.single("photo");
  uploadSingle(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        res.status(400).send(err?.message ?? "Something went wrong");
        return;
      } else if (err) {
        res.status(400).send(err ?? "Something went wrong");
        return;
      }
      // res.send(req.file);
      // res.send(`http://localhost:8000/${req.file?.path}`);
      next();
    } catch (error) {
      res.status(500).send(error?.message ?? "Upload failed");
    }
  });
};
// multiple upload
const uploadMultiple = (req, res, next) => {
  const uploadSingle = multerUtils.array("photo", 5);
  uploadSingle(req, res, function (err) {
    try {
      if (err instanceof multer.MulterError) {
        res.status(400).send(err?.message ?? "Something went wrong!!!");
        return;
      } else if (err) {
        res.status(400).send(err ?? "Something went wrong!!!");
        return;
      }
      // res.send(req.files);
      // res.send(`http://localhost:8000/${req.file?.path}`);
      next();
    } catch (error) {
      res.status(500).send(error?.message ?? "Upload failed");
    }
  });
};
// delete file
const deleteFile = async (req, res) => {
  await unlinkSync(`images/${req.body.name}`);
  res.send("DELETED COMPLETED!");
};

module.exports = { deleteFile, uploadMultiple, uploadSingle };
