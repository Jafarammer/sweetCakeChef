const userModel = require("../../model/userModel");

// ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const getData = await userModel.userAllModel();
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (err) {
    res.status(400).send("Internal server error");
  }
};

// USERS BY ID
const findUser = async (req, res) => {
  try {
    const { id } = req.body;
    const getData = await userModel.findModelId(id);
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (err) {
    res.status(400).send("Internal server error");
  }
};

// ADD NEW USER
const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await userModel.findModelEmail(email);
    const getEmail = data.rows;
    if (getEmail.length != 0) {
      res.status(400).send("Email already exist");
    } else {
      const addUser = await userModel.addUserModel({ name, email, password });

      if (addUser) {
        res.send("Data added successfully");
      } else {
        res.status(400).send("Data failed to add");
      }
    }
  } catch (error) {
    console.log(`Errornya disini nih ${error}`);
    res.status(400).send("Internal server error");
  }
};

// EDIT USERS
const editUser = async (req, res) => {
  try {
    const { name, email, password, id } = req.body;

    const getData = await userModel.findModelId(id);

    if (getData.rowCount > 0) {
      let nameInput = name || getData?.rows[0]?.name;
      let emailInput = email || getData?.rows[0]?.email;
      let passInput = password || getData?.rows[0]?.password;

      const editDataUser = await userModel.editUserModel({
        name: nameInput,
        email: emailInput,
        password: passInput,
        id,
      });

      if (editDataUser) {
        res.send("Data changed successfully");
      } else {
        res.status(400).send("Data failed to change");
      }
    } else {
      res.status(400).send("Data not found");
    }
  } catch (error) {
    res.status(400).send("Internal server error");
  }
};

// DELETE USERS
const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    // Check user by id
    const getData = await userModel.findModelId(id);

    if (getData.rowCount > 0) {
      const deleteUser = await userModel.deleteUserModel(id);

      if (deleteUser) {
        res.send("Data deleted successfully");
      } else {
        res.status(400).send("Data failed to delete");
      }
    } else {
      res.status(400).send("Data not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal server error");
  }
};

module.exports = { findUser, getAllUsers, addUser, editUser, deleteUser };
