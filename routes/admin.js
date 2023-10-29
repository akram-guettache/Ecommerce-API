const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  getAllOrders,
} = require("../controllers/admin");
router.route("/users").get(getAllUsers);
router.route("/updateuser/:id").patch(updateUser);
router.route("/orders").get(getAllOrders);
module.exports = router;
