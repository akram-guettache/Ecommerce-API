const User = require("../models/User");
const Token = require("../models/Token");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const setCookies = require("../utils/setCookies");
const updatepw = async (req, res) => {
  const { password, newpw } = req.body;
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });
  const CPW = await user.comparePW(password);
  if (!CPW) {
    throw new BadRequestError("Password Wrong,Please Try Again");
  }
  user.password = newpw;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "You Updated Your Password Successfully" });
};

const updatepersonalinfo = async (req, res) => {
  const { firstname, lastname, email } = req.body;
  const { userId } = req.user;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { firstname, lastname, email }
  );
  if (!user) {
    throw new NotFoundError("Something Went Wrong!");
  }
  const refreshtoken = await Token.findOne({ user: userId });
  const refreshToken = refreshtoken.refreshToken;
  const token = user.createJWT(refreshToken);
  setCookies(res, token, refreshToken);
  res
    .status(StatusCodes.OK)
    .json({ msg: " You Updated Your Info Successfully" });
};
const deleteaccount = async (req, res) => {
  const { userId } = req.user;
  const { password } = req.body;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError("Something Went Wrong....");
  }
  const CPW = await user.comparePW(password);
  if (!CPW) {
    throw new BadRequestError("Password Wrong,Please Try Again");
  }
  await User.findOneAndDelete({ _id: userId });

  res
    .status(StatusCodes.OK)
    .json({ msg: "You Deleted Your Account Successfully!" });
};

module.exports = { updatepw, updatepersonalinfo, deleteaccount };
