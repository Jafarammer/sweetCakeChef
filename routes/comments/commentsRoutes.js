const Router = require("express").Router();
const controller = require("../../controller/comments/commentController");

Router.post("/add", controller.addComment);
Router.get("/comment/:id", controller.getComment);

module.exports = Router;
