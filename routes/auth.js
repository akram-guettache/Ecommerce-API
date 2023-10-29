const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyaccount,
  forgotPW,
  passwordreset,
} = require("../controllers/auth");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/confirmation/:userId/:verificationToken").get(verifyaccount);
router.route("/forgot-password").post(forgotPW);
router.route("/resetpw/:userId/:passtoken").post(passwordreset);
module.exports = router;
