const Product = require("../models/Product");
const Review = require("../models/Review.js");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const getAllProducts = async (req, res) => {
  const { title, category } = req.query;
  const prod = {};
  if (title) {
    prod.title = { $regex: title, $options: "i" };
  }
  if (category) {
    prod.category = category;
  }

  const product = await Product.find(prod);
  res.status(StatusCodes.OK).json(product);
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError(`No Product Found With The Following ID: ${id}`);
  }
  const reviews = await Review.find({ product: id });

  res.status(StatusCodes.OK).json({ product, reviews });
};

const createProduct = async (req, res) => {
  const { userId } = req.user;
  const { title, description, price, images, category, color } = req.body;
  const { role } = req.user;
  if (role === "user") {
    throw new BadRequestError("You Do Not Have Permission To Do This Task");
  }

  const product = await Product.create({
    title,
    description,
    price,
    images,
    category,
    color,
    seller: userId,
  });

  if (!title || !description || !price) {
    throw new BadRequestError("A title, Description And Price Are Required ");
  }
  res.status(StatusCodes.CREATED).json({ product });
};
const updateProduct = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body);

  if (!product) {
    throw new BadRequestError(
      `You Do not Have Any Products With The Following ID: ${id}`
    );
  }
  if (product.createdBy !== userId) {
    throw new UnauthenticatedError("Not Allowed To Such Operation");
  }
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const {
    user: { userId },
    params: { id: prodId },
  } = req;
  const prod = await Product.findByIdAndRemove({
    _id: prodId,
    createdBy: userId,
  });
  if (!prod) {
    throw new NotFoundError(`No job with id ${prodId}`);
  }
  res.status(StatusCodes.OK).send("done");
};
module.exports = {
  getAllProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};
