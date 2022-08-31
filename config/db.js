// require("dotenv").config();
// const { Pool, Client } = require("pg");

// let connection;

// if (process.env.ENV_MODE === "prod") {
//   connection = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });
// } else {
//   connection = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//   });
// }

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// module.exports = connection;

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
