import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { CLIENT_HOST } from "../utils/env.js";
import cookieParser from "cookie-parser";

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

web.use(morgan("dev"));

web.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

export default web;
