const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
// const multer = require("multer");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
const uploadRoutes = require("./routes/upload/index");

// helmet
app.use(helmet());
// cors
var allowlist = "http://localhost:3000";
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

//import body parser
const bodyParser = require("body-parser"); // lupa

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const userRoutes = require("./routes/user/user");
app.use("/", cors(corsOptionsDelegate), userRoutes);
//login
const userLogin = require("./routes/user/login");
app.use("/", cors(corsOptionsDelegate), userLogin);

// Import routes recipe
const recipeRoutes = require("./routes/recipe/recipe");
// const upload = require("./multer");
app.use("/", cors(corsOptionsDelegate), recipeRoutes);
// image upload
app.use("/images", express.static("images"));
app.use("/", cors(corsOptionsDelegate), uploadRoutes);

app.use("*", (req, res) => {
  res.send("I'm Jafarammer Success");
});

// PORT take in bottom
app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
