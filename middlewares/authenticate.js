const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const setCookies = require("../utils/setCookies");
const { UnauthenticatedError } = require("../errors");

const authenticate = async (req, res, next) => {
  const { RefreshToken, AccessToken } = req.cookies;
  try {
    if (AccessToken) {
      const payload = jwt.verify(AccessToken, process.env.JWT_SECRET);
      req.user = {
        userId: payload.userId,
        firstname: payload.firstname,
        lastname: payload.lastname,
        role: payload.role,
      };
      return next();
    }
    const payload = jwt.verify(RefreshToken.token, process.env.JWT_SECRET);
    const existingToken = await Token.findOne({
      user: payload.userId,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Failed To Auth");
    }
    setCookies(res, RefreshToken.token, existingToken.refreshToken);
    req.user = {
      userId: payload.userId,
      firstname: payload.firstname,
      lastname: payload.lastname,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid Authentication");
  }
};
module.exports = authenticate;
