const jwt = require("jsonwebtoken");
const { SECRET_KEY, JWT_ACCESS_EXPIRES_IN } = require("./env");

export const createAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
};
