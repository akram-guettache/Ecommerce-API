const express = require("express");
const router = express.Router();
const {
  updatepw,
  updatepersonalinfo,
  deleteaccount,
} = require("../controllers/user");
router.route("/updatepw").patch(updatepw);
router.route("/updatepersonalinfo").patch(updatepersonalinfo);
router.route("/deleteaccount").delete(deleteaccount);

module.exports = router;
