const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

// app.use(
//   multer({ storage: fileStoarage, fileFilter: fileFilter }).single("image")
// );
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET POST PUT DELETE PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMsg = err.message;
  const data = err.data;
  res.status(statusCode).json({
    statusCode: statusCode,
    errorMessage: errMsg,
    data: data,
  });
});

console.log(process.env.database_url);

mongoose
  .connect(process.env.database_url)
  .then((result) => {
    // app.listen(3000);
    app.listen(process.env.port);
  })
  .catch((err) => {
    console.log(err);
  });
