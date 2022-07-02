const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    const decode = jwt.verify(
      token?.substring(7, token?.length),
      process.env.SECRET_KEY
    );
    if (decode) {
      next();
    }
  } catch (err) {
    res.status(401).send("Token invalid");
  }
};

module.exports = { checkToken };
