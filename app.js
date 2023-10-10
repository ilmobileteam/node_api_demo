const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { Server } = require("http");

const app = express();

const MONGODB_URI =
  "mongodb+srv://mendisjohn3:X9Du177CpHkhSz3g@cluster0.rvf9gxj.mongodb.net/messages";

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

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(3000, "192.168.29.68");
    // const socketIo = require("socket.io")(server);
    // socketIo.on("connection", (socket) => {
    //   console.log("socket connected :>> ");
    //   socketIo.emit("broadcast", { description: "+1" + " clients connected!" });
    //   socket.on("re", function (data) {
    //     console.log("object :>> ", data);
    //   });
    // });
  })
  .catch((err) => {
    console.log(err);
  });
