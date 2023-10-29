const User = require("../models/User");
const Token = require("../models/Token");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const crypto = require("crypto");
const sendverificationemail = require("../utils/VerifactionMail");
const sendResetEmail = require("../utils/ResetMail");
const setCookies = require("../utils/setCookies");

const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
    verificationToken: verificationToken,
  });
  const origin = "http://localhost:3000";

  await sendverificationemail({
    name: user.firstname,
    email: user.email,
    userId: user._id,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(201).json({
    msg: "Account Created Successfully, Please Check Your Email Adress to Verify Your Account ",
  });
};
const verifyaccount = async (req, res) => {
  const { userId, verificationToken } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No User Found With The Following ID:${userId}`);
  }
  if (verificationToken !== user.verificationToken) {
    throw new BadRequestError("Verification Failed");
  }
  (user.verified = true), (user.verificationToken = "");
  await user.save();
  res.status(200).json({ msg: "Account Verified Successfully" });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please Provide Email And Password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError(
      `No User Found With The Following Email: ${email}`
    );
  }
  const CPW = await user.comparePW(password);
  if (!CPW) {
    throw new BadRequestError("Password Wrong,Please Try Again");
  }
  if (!user.verified) {
    throw new UnauthenticatedError("Please verify your email");
  }
  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    const token = user.createJWT(refreshToken);
    setCookies(res, token, refreshToken);
    res.status(200).json({
      user: { firstname: user.firstname, lastname: user.lastname },
    });
    return;
  }
  refreshToken = crypto.randomBytes(32).toString("hex");
  await Token.create({ refreshToken, user: user._id });
  const token = user.createJWT(refreshToken);
  setCookies(res, token, refreshToken);
  res.status(200).json({
    user: { firstname: user.firstname, lastname: user.lastname },
  });
};

const forgotPW = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError(`No User With The Following Email: ${email}`);
  }
  const origin = "http://localhost:3000";
  const passtoken = crypto.randomBytes(26).toString("hex");
  await sendResetEmail({
    name: user.firstname,
    email: user.email,
    userId: user._id,
    passtoken: passtoken,
    origin,
  });
  const fifteen = 1000 * 60 * 15;
  const expirationDate = new Date(Date.now() + fifteen);
  user.passtoken = passtoken;
  user.pwrexp = expirationDate;
  await user.save();
  res
    .status(200)
    .json({ msg: "Please Check Your Email To Reset Your Password" });
};
const passwordreset = async (req, res) => {
  const { userId, passtoken } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No User Found With The Following ID: ${userId}`);
  }
  if (passtoken !== user.passtoken) {
    throw new BadRequestError(`Token Verification Failed, Please Verify It`);
  }
  const currentDate = new Date();
  if (user.pwrexp < currentDate) {
    throw new BadRequestError(
      "Token Expired Please Try To request another Token "
    );
  }
  const { password } = req.body;
  user.password = password;
  user.passtoken = null;
  user.pwrexp = null;
  await user.save();
  res.status(200).json({ msg: "You Changed Your Password Successfully" });
};
const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(StatusCodes.OK).json("Logged Out Successfully");
  res.redirect("/");
};
module.exports = {
  register,
  login,
  logout,
  verifyaccount,
  forgotPW,
  passwordreset,
};
