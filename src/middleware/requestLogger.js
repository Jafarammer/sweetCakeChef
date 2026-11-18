import { logging } from "../app/logging.js";

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    const message = [
      `${req.method} ${req.originalUrl}`,
      `Status: ${res.statusCode}`,
      `Duration: ${duration}ms`,
    ].join(" | ");

    if (res.statusCode >= 500) {
      logging.error(`[REQUEST] ${message}`);
    } else if (res.statusCode >= 400) {
      logging.warn(`[REQUEST] ${message}`);
    } else {
      logging.http(`[REQUEST] ${message}`);
    }
  });

  next();
};

export default requestLogger;
