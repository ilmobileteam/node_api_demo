const express = require("express");
const route = express.Router();
const movieController = require("../controllers/movie");

route.get("/getmovies", movieController.getMovieList);

module.exports = route;
