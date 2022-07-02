const userModel = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const getEmail = await userModel.findModelEmail(email);
    if (getEmail?.rowCount) {
      // validation password
      /** cek encrypt password use bcrypt.compareSync, result = true or false */
      const checkPassword = bcrypt.compareSync(
        password,
        getEmail?.rows[0]?.password
      );
      if (checkPassword) {
        // if not expiresIn changed getEmial become string => jwt.sign(JSON.stringify(getEmail?.rows[0]).
        const token = jwt.sign(
          getEmail?.rows[0],
          "d8f9f27fb0d678a8e8493ce31d17ab10c236b578e16e1a20bf36687adc2b996b",
          { expiresIn: "24h" }
        );
        res.status(200).send(token);
      } else {
        res.status(401).send("Incorrect password!!!");
      }
    } else {
      res.status(400).send("Data not found");
    }
  } catch (err) {
    console.log(`Error in here ${err}`);
    res.status(500).send("Internal server error");
  }
};

module.exports = { login };
