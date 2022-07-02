const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();

// app.use(
//   cors({
//     origin: "https://id-id.facebook.com/",
//   })
// );
app.use(helmet());

//import body parser
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// const userRoutes = require("./routes/user/userRoutes");
// app.use("/", userRoutes);

// import routes users
// const userRoutes = require("./routes/user/user");
// app.use("/", cors, userRoutes);

const userRoutes = require("./routes/user/user");
app.use("/", userRoutes);
//login
const userLogin = require("./routes/user/login");
app.use("/", userLogin);

// Import routes recipe
const recipeRoutes = require("./routes/recipe/recipe");
app.use("/", recipeRoutes);

// PORT take in bottom
app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
