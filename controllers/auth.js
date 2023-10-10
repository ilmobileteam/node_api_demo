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
        return res.status(CREATED).json({
          status: 1,
          message: "User is created successfully.",
          token: token.token,
          data: createUser.data,
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
      console.log("token :>> ", token);
      return res.status(OK_STATUS).json({
        status: 1,
        message: "User is logged in successfully.",
        token: token.token,
        data: findUser.data,
      });
    } else {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: "Password is wrong." });
    }
  } else {
    if (findUser?.data?.is_delete) {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: "You need to signup again." });
    } else {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: "Email or password is wrong." });
    }
  }
};
