const jwt = require("jsonwebtoken");
const util = require("util");

const tokenExpDate = require("../../index.js").tokenExpDate;
const secret = require("../../index.js").secret;

module.exports = (user) => {
  return util.promisify(jwt.sign)({ email: user.email, id: user._id }, secret, {
    expiresIn: tokenExpDate,
  });
};
