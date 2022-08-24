const userModel = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

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
        /**
         * NOTE
         * process.env.SECRET_KEY changed to string ->  veryveryimportant
         * if you can't text veryveryimportant convert using sha256
         * Create SECRET_KEY in your file .env and paste result convert text veryveryimportant
         */

        // if not expiresIn changed getEmial become string => jwt.sign(JSON.stringify(getEmail?.rows[0]).
        const token = jwt.sign(getEmail?.rows[0], process.env.SECRET_KEY, {
          expiresIn: "24h",
        });
        res.status(200).send({
          user: { ...getEmail?.rows[0], ...{ password: null } },
          token,
        });
      } else {
        res.status(401).send("Incorrect password!!!");
      }
    } else {
      res.status(400).send("User not listed");
    }
  } catch (err) {
    console.log(`Error in here ${err}`);
    res.status(500).send("Internal server error");
  }
};

module.exports = { login };
