const jwt = require("jsonwebtoken");

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    const decode = jwt.verify(
      token?.substring(7, token?.length),
      "d8f9f27fb0d678a8e8493ce31d17ab10c236b578e16e1a20bf36687adc2b996b"
    );
    if (decode) {
      next();
    }
  } catch (err) {
    res.status(401).send("Token invalid");
  }
};

module.exports = { checkToken };
