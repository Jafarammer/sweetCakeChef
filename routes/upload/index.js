const Router = require("express").Router();
const upload = require("../../middleware/upload");
Router.post("/image", upload.uploadSingle, (req, res) => {
  console.log(req);
  res.send("sukses");
});

module.exports = Router;
