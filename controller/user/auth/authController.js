const model = require("../../../model/user/userModel");
const searchModel = require("../../../model/user/searchUserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const searchEmail = await searchModel.getByEmail(email);
    if (searchEmail?.rowCount) {
      const checkPassword = bcrypt.compareSync(
        password,
        searchEmail?.rows[0]?.password
      );
      if (checkPassword) {
        const token = jwt.sign(searchEmail?.rows[0], process.env.SECRET_KEY, {
          expiresIn: "24",
        });
        res.status(200).send({
          user: { ...searchEmail?.rows[0], ...{ password: null } },
          token,
          message: "Login success",
        });
      } else {
        res.status(404).send("Incorect password!!!");
      }
    } else {
      res.status(400).send("You have not registered!!!");
    }
  } catch (error) {
    console.log(`error in here ${error}`);
    res.status(400).send("Any error!!!");
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phone_number, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      res.status(400).send("Password not same!!!");
    } else {
      const searchEmail = await searchModel.getByEmail(email);
      const getEmail = searchEmail.rows;

      //   ecrypt password
      const salt = bcrypt.genSaltSync(15); // generate string
      const hash = bcrypt.hashSync(password, salt); // encrypt password

      if (getEmail.length != 0) {
        res.status(400).send("Email already exist!!!");
      } else if (req.body.email == "") {
        res.status(400).send("Email is required!!!");
      } else {
        const getData = await model.addUserModel({
          name,
          email,
          phone_number,
          password: hash,
          // photo,
        });
        if (getData) {
          res.status(200).send("Register successfully");
        } else {
          res.status(400).send("Regisater failed!!!");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Any error");
  }
};

module.exports = { login, register };
