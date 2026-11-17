import dotenv from "dotenv";

dotenv.config();

export const SECRET_KEY = process.env.SECRET_KEY;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
export const CLIENT_HOST = process.env.CLIENT_HOST;
export const PORT = process.env.PORT;
export const PGUSER = process.env.PGUSER;
export const PGHOST = process.env.PGHOST;
export const PGDATABASE = process.env.PGDATABASE;
export const PGPASSWORD = process.env.PGPASSWORD;
export const PGPORT = process.env.PGPORT;
