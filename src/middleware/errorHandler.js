import { logging } from "../app/logging.js";

const errorHandler = (error, req, res, next) => {
  logging.error(`[ERROR] ${error.stack || error.message}`);

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Internal server error" : error.message,
  });
};

export default errorHandler;
