const jsonwebtoken = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const QUERY = {
  find: "find",
  findOne: "findOne",
  create: "create",
  findOneAndUpdate: "findOneAndUpdate",
  upsert: "upsert",
  findOneAndDelete: "findOneAndDelete",
  countDocuments: "countDocuments",
};

const HTTPStatus = {
  OK_STATUS: 200,
  CREATED: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

const {
  find,
  findOne,
  create,
  findOneAndUpdate,
  upsert,
  findOneAndDelete,
  countDocuments,
} = QUERY;
const common_error_message = "Some thing went wrong.";
const please_login_again = "Please login again.";
const only_admin_access = "Only admin can access this.";

const commonQuery = async (
  model,
  query,
  data = {},
  update = {},
  select = "",
  populate = null,
  perPage = 0,
  page = 0
) => {
  try {
    const skip = perPage * (page - 1);
    let res;
    switch (query) {
      case find:
        res = await model
          .find(data)
          .sort(update)
          .limit(perPage)
          .skip(skip)
          .select(select)
          .populate(populate)
          .setOptions({ allowDiskUse: true });
        break;
      case findOne:
        res = await model
          .findOne(data)
          .select(select)
          .populate(populate)
          .lean();
        break;
      case create:
        res = await model.create(data);
        break;
      case findOneAndUpdate:
        res = await model
          .findOneAndUpdate(data, update, { returnNewDocument: true })
          .select(select);
        break;
      case upsert:
        res = await model.findOneAndUpdate(data, update, {
          upsert: true,
          new: true,
        });
        break;
      case findOneAndDelete:
        res = await model.findOneAndDelete(data);
        break;
      case countDocuments:
        res = await model.countDocuments(data);
        break;
    }
    if (!data || !res || res.length == 0) {
      return {
        status: 2,
        message: common_error_message,
      };
    } else {
      return {
        status: 1,
        data: res,
      };
    }
  } catch (error) {
    return {
      status: 0,
      error: error,
    };
  }
};

const createBcryptPassword = async (password) => {
  try {
    let hash_password = await bcryptjs.hash(password, 12);
    console.log("hash_password :>> ", hash_password);
    return {
      status: 1,
      hash_password: hash_password,
    };
  } catch (error) {
    return {
      status: 0,
      error: common_error_message,
    };
  }
};

const checkBcryptPassword = async (password, savedPassword) => {
  try {
    let is_match = await bcryptjs.compare(password, savedPassword);
    if (!is_match) {
      return {
        status: 0,
        message: "Password do not match.",
      };
    } else {
      return {
        status: 1,
        message: "Password Matched",
      };
    }
  } catch (error) {
    return {
      status: 0,
      error: common_error_message,
    };
  }
};

const generateToken = async (data, expire = null) => {
  try {
    let optionalData = {};
    if (expire) {
      optionalData = { expiresIn: expire };
    }
    const token = jsonwebtoken.sign(
      data,
      "NehilKoshiyaSecretKeyVerySecret",
      optionalData
    );
    return {
      status: 1,
      token: token,
    };
  } catch (error) {
    return {
      status: 0,
      error: error,
    };
  }
};

const verifyToken = async (token) => {
  try {
    const verify = jsonwebtoken.verify(
      token,
      "NehilKoshiyaSecretKeyVerySecret"
    );
    return {
      status: 1,
      verify: verify,
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message,
    };
  }
};

module.exports = {
  QUERY,
  HTTPStatus,
  common_error_message,
  please_login_again,
  only_admin_access,
  commonQuery,
  createBcryptPassword,
  checkBcryptPassword,
  generateToken,
  verifyToken,
};
