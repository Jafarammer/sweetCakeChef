const multer = require("multer");
const multerUtils = require("../multer");

const uploadSingle = (req, res, next) => {
  const uploadSingle = multerUtils.single("image");
  uploadSingle(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(400).send(err?.message ?? "sometihng went wrong");
        return;
      } else if (err) {
        res.status(400).send(err ?? "something went wrong 2");
        return;
      }
      //   res.send(`http://localhost:8000/${req.file?.path}`);
      next();
      // res.send(req.file);
    } catch (error) {
      res.status(500).send(error?.message ?? "upload failed");
    }
  });
};

module.exports = { uploadSingle };
