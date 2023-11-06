const User = require("../model/user");
const {
  createBcryptPassword,
  generateToken,
  checkBcryptPassword,
  common_error_message,
  HTTPStatus: { OK_STATUS, CREATED, BAD_REQUEST },
  QUERY: { findOne, create },
  commonQuery,
} = require("../helper/common_helper");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const findUser = await commonQuery(User, findOne, { email });

  if (findUser.status == 1) {
    return res.status(BAD_REQUEST).json({
      status: 0,
      message: "User is already exist.",
    });
  } else {
    const hashPw = await createBcryptPassword(password);
    if (hashPw.status == 1) {
      const createUser = await commonQuery(User, create, {
        email: email,
        password: hashPw.hash_password,
        name: name,
      });

      if (createUser.status == 1) {
        const token = await generateToken({
          email: email,
          userId: createUser.data._id,
        });

        const userData = {
          email: createUser.data.email,
          name: createUser.data.name,
          posts: [],
          _id: createUser.data._id,
          createdAt: createUser.data.createdAt,
          updatedAt: createUser.data.updatedAt,
        };

        return res.status(CREATED).json({
          status: 1,
          message: "User created successfully.",
          token: token.token,
          data: userData,
        });
      } else {
        return res
          .status(BAD_REQUEST)
          .json({ status: 0, message: common_error_message });
      }
    } else {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: common_error_message });
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const populateData = [
    {
      path: "posts",
    },
  ];

  const findUser = await commonQuery(
    User,
    findOne,
    { email },
    {},
    "",
    populateData
  );

  if (findUser.status == 1) {
    const checkPassword = await checkBcryptPassword(
      password,
      findUser.data.password
    );
    if (checkPassword.status == 1) {
      const token = await generateToken({
        email: email,
        userId: findUser.data._id,
      });

      const userData = {
        email: findUser.data.email,
        name: findUser.data.name,
        posts: findUser.data.posts,
        _id: findUser.data._id,
        createdAt: findUser.data.createdAt,
        updatedAt: findUser.data.updatedAt,
      };

      return res.status(OK_STATUS).json({
        status: 1,
        message: "User logged in successfully.",
        token: token.token,
        data: userData,
      });
    } else {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: "Please check password." });
    }
  } else {
    if (findUser?.data?.is_delete) {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: "User does not exist." });
    } else {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: "Email or password is wrong." });
    }
  }
};
