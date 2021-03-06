const userModel = require("../../model/userModel");
const bcrypt = require("bcrypt");
// const { emptyQuery } = require("pg-protocol/dist/messages");
// const jwt = require("jsonwebtoken");

// ALL USERS
const getAllUsers = async (req, res) => {
  try {
    // const { page, size } = req.query;
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

// pagination
const findPage = async (req, res) => {
  try {
    const { page, size } = req.query;
    const getData = await userModel.findModelPage(page, size);
    res.send({
      data: getData.rows,
      total: getData.rowCount,
    });
  } catch (err) {
    res.status(400).send("Internal server error");
  }
};

// ADD NEW USER
const addUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      res.status(400).send("Passwords are not the same!!!");
    } else {
      const data = await userModel.findModelEmail(email);
      const getEmail = data.rows;

      // encrypt password
      const salt = bcrypt.genSaltSync(15); //generate string
      const hash = bcrypt.hashSync(password, salt); //encrypt password

      // validate email
      if (getEmail.length != 0) {
        res.status(400).send("Email already exist");
      } else if (req.body.email == "") {
        res.status(400).send("Email is required!!!");
      } else {
        const addUser = await userModel.addUserModel({
          name,
          email,
          phoneNumber,
          password: hash,
        });

        if (addUser) {
          res.send("Data added successfully");
        } else {
          res.status(400).send("Data failed to add");
        }
      }
    }
  } catch (error) {
    // console.log(`Errornya disini nih ${error}`);
    res.status(500).send("Email invalid!!!");
    // res.status(400).send(error?.message ?? "Something went wrong!");
  }
};

// EDIT USERS
const editUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, id } = req.body;

    const getData = await userModel.findModelId(id);

    if (getData.rowCount > 0) {
      let nameInput = name || getData?.rows[0]?.name;
      let emailInput = email || getData?.rows[0]?.email;
      let phoneNumberInput = phoneNumber || getData?.rows[0]?.phoneNumber;
      let passInput = password || getData?.rows[0]?.password;

      const editDataUser = await userModel.editUserModel({
        name: nameInput,
        email: emailInput,
        phoneNumber: phoneNumberInput,
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

module.exports = {
  findUser,
  getAllUsers,
  addUser,
  editUser,
  deleteUser,
  findPage,
};
