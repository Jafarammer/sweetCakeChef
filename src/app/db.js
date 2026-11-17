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

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    logging.info("DB connected successfully!");

    client.release();
  } catch (error) {
    logging.error(`DB connection failed: ${error.message}`);
    throw error;
  }
};

export default pool;
