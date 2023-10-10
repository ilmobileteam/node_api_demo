const express = require("express");
const multer = require("multer");
const feedController = require("../controllers/feed");
const route = express.Router();
const { authentication } = require("../helper/middleware");
const { createPostValidator } = require("../validators/common_validators");

const fileStoarage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// GET /feed/posts
route.get("/posts", authentication, feedController.getPosts);

// POST /feed/posts
route.post(
  "/posts",
  authentication,
  multer({ storage: fileStoarage, fileFilter: fileFilter }).single("image"),
  createPostValidator,
  feedController.creatPosts
);

// GET /feed/posts/id
route.post("/getSinglePost", authentication, feedController.getSinglePost);

// PUT /feed/posts/id
route.put("/posts/:postId", authentication, feedController.editPost);

// DELETE /feed/posts/id
route.delete("/posts/:postId", authentication, feedController.deletePost);

module.exports = route;
