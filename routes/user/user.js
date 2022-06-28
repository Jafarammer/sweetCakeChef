const Router = require("express").Router();
const controllerUser = require("../../controller/user/userController");

Router.get("/users", controllerUser.getAllUsers);

Router.get("/users/find", controllerUser.findUser);

Router.post("/users/add", controllerUser.addUser);

Router.patch("/users/edit", controllerUser.editUser);

Router.delete("/users/delete", controllerUser.deleteUser);

module.exports = Router;
