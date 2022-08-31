const Router = require("express").Router();
const upload = require("../../middleware/uploadImages");

// single
Router.use("/upload/image", upload.uploadSingle, (req, res) => {
  res.send("Upload success");
});

// multiple
Router.use("/upload/images", upload.uploadMultiple, (req, res) => {
  res.send("Upload success");
});

// delete image
Router.delete("/delete/file", upload.deleteFile);

module.exports = Router;
