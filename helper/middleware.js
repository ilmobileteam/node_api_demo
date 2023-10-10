const {
  HTTPStatus: { UNAUTHORIZED, FORBIDDEN },
  verifyToken,
} = require("./common_helper");

authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res
        .status(FORBIDDEN)
        .json({ status: 0, message: "Access denied." });
    const decoded = await verifyToken(token);
    if (decoded.status == 1) {
      req.user = decoded;
      next();
    } else {
      return res.status(UNAUTHORIZED).json(decoded);
    }
  } catch (error) {
    return res.status(FORBIDDEN).json({ status: 0, message: "Invalid token." });
  }
};

module.exports = { authentication };
