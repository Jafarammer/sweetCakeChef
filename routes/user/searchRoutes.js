const Router = require("express").Router();
const controller = require("../../controller/user/searchUserController");

// Find all
Router.get("/", controller.findAllUser);
// Find By Id
Router.get("/id/:id", controller.findById);
// Find by name
Router.get("/name", controller.findByName);
// Find by email
Router.get("/email", controller.findByEmail);
// Find page
Router.get("/find", controller.findPage);

module.exports = Router;
