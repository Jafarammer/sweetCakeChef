const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();
const connection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
module.exports = connection;
