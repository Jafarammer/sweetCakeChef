import winston from "winston";
import { NODE_ENV } from "../utils/env.js";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const IS_DEV = NODE_ENV === "development";

const devFormat = combine(
  colorize({ all: true }),
  timestamp({
    format: () =>
      new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      }),
  }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${stack || message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const logging = winston.createLogger({
  level: IS_DEV ? "debug" : "info",
  defaultMeta: {
    service: "sweet-cake-api",
  },
  format: IS_DEV ? devFormat : prodFormat,
  transports: [new winston.transports.Console()],
  // Log untuk error yang tidak tertangani
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
  exitOnError: false,
});

export { logging };
