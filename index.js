const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 8000;
// const port = 8000;
const cors = require("cors");

const helmet = require("helmet");
dotenv.config();
// user
const userRoutes = require("./routes/user/userRoutes");
const searchUserRoutes = require("./routes/user/searchRoutes");
const authRoutes = require("./routes/user/auth/authRoutes");
// recipe
const searchRecipeRoutes = require("./routes/recipe/searchRecipeRoutes");
const recipeRoutes = require("./routes/recipe/recipeRoutes");
// upload
const uploadRoutes = require("./routes/upload/index");

// helmet
app.use(helmet());
// cors
// var allowlist = "http://localhost:3000/";
var allowlist = "https://sweet-cake-react.web.app/";
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
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/", cors(corsOptionsDelegate), userRoutes);

// user
app.use("/users", cors(corsOptionsDelegate), userRoutes);
app.use("/users", cors(corsOptionsDelegate), searchUserRoutes);
// auth
app.use("/", cors(corsOptionsDelegate), authRoutes);
// app.use("/", cors(corsOptionsDelegate), userLogin); example
// routes recipe
app.use("/recipe", cors(corsOptionsDelegate), searchRecipeRoutes);
app.use("/recipe", cors(corsOptionsDelegate), recipeRoutes);
// image upload
app.use("/images", express.static("images"));
app.use("/upload", cors(corsOptionsDelegate), uploadRoutes);

app.use("*", (req, res) => {
  res.send("I'm Jafarammer Success");
});

// PORT take in bottom
app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
