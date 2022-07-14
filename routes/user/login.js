const Router = require("express").Router();
const controllerLogin = require("../../controller/user/loginController");
const validateToken = require("../../middleware/verifyToken");

// Router.post("/login", validateToken.checkToken, controllerLogin.login);
Router.post("/login", controllerLogin.login);

module.exports = Router;
