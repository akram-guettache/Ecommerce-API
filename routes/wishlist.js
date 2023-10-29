const express = require("express");
const router = express.Router();

const {
  addproducttowishlist,
  removefromwishlist,
  getwishlist,
} = require("../controllers/wishlist");

router.route("/").get(getwishlist).post(addproducttowishlist);
router.route("/:id").delete(removefromwishlist);
module.exports = router;
