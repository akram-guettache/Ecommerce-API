const User = require("../models/User");
const Order = require("../models/Order");
const { NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const { role, email, password, firstname, lastname } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { role, email, password, firstname, lastname }
  );
  if (!user) {
    throw new NotFoundError(`No User Found With The Following ID: ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  if (!orders) {
    throw new NotFoundError("It Ain't going great ey!");
  }
  res.status(StatusCodes.OK).json({ orders });
};

module.exports = { getAllUsers, updateUser, getAllOrders };
