const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/env");

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decode = jwt.verify(token, SECRET_KEY);
    req.user = decode;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
