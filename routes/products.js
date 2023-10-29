const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
} = require("../controllers/products");
const authenticate = require("../middlewares/authenticate");
router.route("/").get(getAllProducts).post(authenticate, createProduct);
router
  .route("/:id")
  .get(getProduct)
  .patch(authenticate, updateProduct)
  .delete(authenticate, deleteProduct);
module.exports = router;
