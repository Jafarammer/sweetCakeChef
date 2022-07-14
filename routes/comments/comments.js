const Router = require("express").Router();
const commentController = require("../../controller/comments/commentController");

Router.post("/addCom", commentController.addComment);

Router.delete("/delCom", commentController.deleteComment);

Router.get("/comment", commentController.getAllComments);

module.exports = Router;
