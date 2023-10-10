const joi = require("joi");
const common_helper = require("../helper/common_helper");

const {
  HTTPStatus: { BAD_REQUEST },
} = common_helper;

apiSignupValidator = (req, res, next) => {
  const JoiSchema = joi.object({
    name: joi.string().alphanum().min(3).max(30).required(),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .trim()
      .required(),
    password: joi.string().min(8).max(16).required(),
  });
  const { error } = JoiSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: error.message.toString() });
  } else {
    next();
  }
};

apiLoginValidator = (req, res, next) => {
  const JoiSchema = joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .trim()
      .required(),
    password: joi.string().min(8).max(16).required(),
  });
  const { error } = JoiSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: error.message.toString() });
  } else {
    next();
  }
};

createPostValidator = (req, res, next) => {
  const JoiSchema = joi.object({
    title: joi.string().min(3).max(20).required(),
    subTitle: joi.string().min(8).max(50).required(),
  });
  const { error } = JoiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: error.message.toString() });
  } else {
    next();
  }
};

module.exports = { apiSignupValidator, apiLoginValidator, createPostValidator };
