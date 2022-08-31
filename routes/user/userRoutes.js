const Router = require("express").Router();
const controller = require("../../controller/user/usersController");
const uploadMiddleware = require("../../middleware/uploadImages");

// ADD
Router.post("/add", controller.addUser);
// EDIT
Router.patch("/edit/:id", uploadMiddleware.uploadSingle, controller.editUser);
// DELETE
Router.delete("/delete/:id", controller.deleteUser);

module.exports = Router;
