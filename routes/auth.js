const express = require("express");
const authController = require("../controllers/auth");
const user = require("../model/user");
const { body } = require("express-validator");
const {
  apiSignupValidator,
  apiLoginValidator,
} = require("../validators/common_validators");

const route = express.Router();

route.post("/signup", apiSignupValidator, authController.signup);

route.post("/login", apiLoginValidator, authController.login);

module.exports = route;
