const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
} = require("../controllers/order");

router.route("/addtocart").post(createOrder);
router.route("/cart").get(getOrders);
router.route("/:id").patch(updateOrder).delete(deleteOrder).get(getSingleOrder);
module.exports = router;
