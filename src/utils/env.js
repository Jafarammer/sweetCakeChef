import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const SECRET_KEY = process.env.SECRET_KEY;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
export const CLIENT_HOST = process.env.CLIENT_HOST;
export const PORT = process.env.PORT;
export const PGUSER = process.env.PGUSER;
export const PGHOST = process.env.PGHOST;
export const PGDATABASE = process.env.PGDATABASE;
export const PGPASSWORD = process.env.PGPASSWORD;
export const PGPORT = process.env.PGPORT;
export const SLOW_QUERY_THRESHOLD = process.env.SLOW_QUERY_THRESHOLD;
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
