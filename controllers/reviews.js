const Review = require("../models/Review.js");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const addReview = async (req, res) => {
  const { product: productId } = req.body;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No Product With The following ID : ${productId}`);
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  const reviews = await Review.find({ product: productId });
  const totalratnings = reviews.length;
  const ratingsum = reviews
    .map((e) => e.rating)
    .reduce((prev, curr) => prev + curr, 0);
  const temp = ratingsum / totalratnings;
  const averagerating = +temp.toFixed(2);
  const finalproduct = await Product.findByIdAndUpdate(
    { _id: productId },
    { rating: averagerating }
  );

  res.status(StatusCodes.CREATED).json({ review });
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { title, details, rating } = req.body;
  const review = await Review.findOneAndUpdate(
    { _id: id, user: userId },
    { title, details, rating }
  );
  if (!review) {
    throw new NotFoundError(`No Review Found With The Following ID:${id}`);
  }
  res.status(StatusCodes.CREATED).json({ msg: "Review Updated Successfully!" });
};
const getAllReviews = async (req, res) => {
  const { id } = req.params;
  const review = await Review.find({ product: id });
  res.status(StatusCodes.CREATED).json({ review });
};
const getReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById({ _id: id })
    .populate({
      path: "product",
      select: "title price",
    })
    .populate({ path: "user", select: "firstname lastname" });
  if (!review) {
    throw new NotFoundError(`No Error With The following ID: ${id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const review = await Review.findOneAndDelete({ _id: id, user: userId });
  if (!review) {
    throw new NotFoundError(`No Review Found With The Following ID:${id}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Review Deleted Successfully" });
};

module.exports = {
  addReview,
  updateReview,
  getAllReviews,
  getReview,
  deleteReview,
};
