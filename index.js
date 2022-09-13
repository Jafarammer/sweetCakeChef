const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
// const port = 8000;
const cors = require("cors");

const helmet = require("helmet");
// user
const userRoutes = require("./routes/user/userRoutes");
const searchUserRoutes = require("./routes/user/searchRoutes");
const authRoutes = require("./routes/user/auth/authRoutes");
// recipe
const searchRecipeRoutes = require("./routes/recipe/searchRecipeRoutes");
const recipeRoutes = require("./routes/recipe/recipeRoutes");
// comment
const commentRoutes = require("./routes/comments/commentsRoutes");
// upload
const uploadRoutes = require("./routes/upload/index");

// helmet
app.use(helmet());
// cors
// // var allowlist = "http://localhost:3000/";
// var allowlist = "https://sweet-cake-react.web.app/";
// // var allowlist = ["https://sweet-cake-react.web.app/", "http://localhost:3000/"];
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = { origin: true };
//   } else {
//     corsOptions = { origin: false };
//   }
//   callback(null, corsOptions);
// };
//import body parser
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/", cors(corsOptionsDelegate), userRoutes);
const corsOptions = {
  origins: ["https://sweet-cake-react.web.app", "http://localhost:3000/"],
};
app.use(cors(corsOptions));

// user
app.use("/users", userRoutes);
app.use("/users", searchUserRoutes);
// auth
app.use("/", authRoutes);
// app.use("/", userLogin); example
// recipe
app.use("/recipe", searchRecipeRoutes);
app.use("/recipe", recipeRoutes);
// comment
app.use("/comment", commentRoutes);
// image upload
app.use("/images", express.static("images"));
app.use("/upload", uploadRoutes);

app.use("*", (req, res) => {
  res.send("I'm Jafarammer Success");
});

// PORT take in bottom
app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
