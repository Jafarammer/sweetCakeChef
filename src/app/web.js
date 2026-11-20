import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { CLIENT_HOST } from "../utils/env.js";
import cookieParser from "cookie-parser";
import requestLogger from "../middleware/requestLogger.js";
import errorHandler from "../middleware/errorHandler.js";
// router
import authRoutes from "../routes/auth.routes.js";
import recipeRoutes from "../routes/recipe.routes.js";

const web = express();

web.use(helmet());
web.use(express.json());
web.use(cookieParser());

const allowedOrigins = [CLIENT_HOST].filter(Boolean);

web.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

web.use(requestLogger);

web.use(morgan("dev"));
web.use("/api/auth", authRoutes);
web.use("/api/recipe", recipeRoutes);

web.use(errorHandler);

web.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

export default web;
