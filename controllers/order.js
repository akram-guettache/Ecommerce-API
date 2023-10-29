const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const createOrder = async (req, res) => {
  const { userId } = req.user;
  const { product, count, color } = req.body;
  const prod = await Product.findOne({ _id: product });
  if (!prod) {
    throw new NotFoundError(
      `No Product Found With The Following Id: ${product}`
    );
  }
  const temp = await Order.findOne({ orderedBy: userId, product: product });
  if (temp) {
    throw new BadRequestError(
      `You Already Made An Order For The Porduct With The Following ID: ${product}`
    );
  }
  const order = await Order.create({
    product,
    count,
    color,
    orderedBy: userId,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Product Added To Cart Successfully, Details About Order:",
    order,
  });
};

const getOrders = async (req, res) => {
  const { userId } = req.user;
  const orders = await Order.find({ orderedBy: userId }).populate("product");
  if (!orders || orders.product === null) {
    throw new NotFoundError("You Do Not Have Any Orders At The Moment ");
  }
  const carttotal = orders
    .map((e) => e.product.price * e.count)
    .reduce((prev, curr) => prev + curr);
  res.status(StatusCodes.OK).json({
    orders,
    msg: `Your Cart Total Is : ${carttotal}$`,
  });
};
const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const order = await Order.findOne({ _id: id, orderedBy: userId });
  if (!order) {
    throw new NotFoundError(`You Have No Order With The Following ID:${id}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { color, count } = req.body;
  const order = await Order.findOneAndUpdate(
    { _id: id, orderedBy: userId },
    { color, count }
  );

  if (!order) {
    throw new NotFoundError(`You Have No Order With The Following ID:${id} `);
  }
  res.status(StatusCodes.OK).json({ msg: "Order Updated Successfully", order });
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const order = await Order.findOneAndDelete({ _id: id, orderedBy: userId });
  if (!order) {
    throw new NotFoundError(`You Have No Order With The Following ID:${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Order Deleted Successfully" });
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getSingleOrder,
};
