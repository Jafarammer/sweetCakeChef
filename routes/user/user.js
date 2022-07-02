const Router = require("express").Router();
const controllerUser = require("../../controller/user/userController");
const validateToken = require("../../middleware/verifyToken");

Router.get("/users", validateToken.checkToken, controllerUser.getAllUsers);
// Router.get("/users", controllerUser.getAllUsers);

Router.get("/users/find", controllerUser.findUser);

Router.get("/users/findPage", controllerUser.findPage);

Router.post("/users/add", controllerUser.addUser);

Router.patch("/users/edit", controllerUser.editUser);

Router.delete("/users/delete", controllerUser.deleteUser);

module.exports = Router;
