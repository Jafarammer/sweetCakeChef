const dotenv = require("dotenv");

dotenv.config();

export const SECRET_KEY = process.env.SECRET_KEY;
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
