const Router = require("express").Router();
const controllerLogin = require("../../controller/user/loginController");

Router.post("/login", controllerLogin.login);

module.exports = Router;
