const Router = require("express").Router();
const controller = require("../../../controller/user/auth/authController");

// loign
Router.post("/login", controller.login);
// register
Router.post("/register", controller.register);

module.exports = Router;
