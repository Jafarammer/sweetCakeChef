import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../utils/env.js";

const authToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required!",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authToken;
