const express = require("express");
const router = express.Router();
const {
  addReview,
  updateReview,
  getAllReviews,
  getReview,
  deleteReview,
} = require("../controllers/reviews");
const authenticate = require("../middlewares/authenticate");
router.route("/").post(authenticate, addReview);
router
  .route("/:id")
  .get(getAllReviews)
  .get(getReview)
  .patch(authenticate, updateReview)
  .delete(authenticate, deleteReview);
module.exports = router;
