import pg from "pg";
import {
  PGDATABASE,
  PGHOST,
  PGPASSWORD,
  PGPORT,
  PGUSER,
} from "../utils/env.js";
import { logging } from "./logging.js";

const { Pool } = pg;

const pool = new Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: Number(PGPORT),
});

pool.on("error", (error) => {
  logging.error(`[DB] Unexpected pool error: ${error.message}`);
});

export const connectDB = async () => {
  let client;

  try {
    client = await pool.connect();

    logging.info("[DB] Database connected successfully!");
  } catch (error) {
    logging.error(`[DB] Database connection failed: ${error.message}`);
    throw error;
  } finally {
    client?.release();
  }
};

export default pool;
