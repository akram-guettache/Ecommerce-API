const Product = require("../models/Product");
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const addproducttowishlist = async (req, res) => {
  const { id } = req.body;
  const prod = await Product.findById(id);
  if (!prod) {
    throw new NotFoundError(`No Product Founnd With The Following ID:${id}`);
  }
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });
  const { wishlist } = user;
  const temp = await User.findOne({ _id: userId, wishlist: id });
  if (temp) {
    throw new BadRequestError("The Product Is Already In Your Wishlist");
  }
  user.wishlist = [...wishlist, id];
  user.save();
  const result = await User.findOne({ _id: userId }).populate("wishlist");
  const wl = result.wishlist;
  res.status(StatusCodes.OK).json({
    msg: "Product Added To Your Wishlist Successfully, Your Wishlist: ",
    wl,
  });
};

const removefromwishlist = async (req, res) => {
  const { userId } = req.user;
  const { id: prodid } = req.params;
  const user = await User.findOne({ _id: userId });
  let array = user.wishlist;

  if (array.includes(prodid) === true) {
    const tobedeleted = array.indexOf(prodid);
    array.splice(tobedeleted, 1);
    user.wishlist = array;
    user.save();
    res
      .status(StatusCodes.OK)
      .json({ msg: "Deleted From Your Wishlist Successfully!" });
  } else {
    throw new BadRequestError("Failed...");
  }
};

const getwishlist = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId }).populate("wishlist");
  if (!user) {
    throw new NotFoundError("User Not Found");
  }
  res.status(StatusCodes.OK).json({ " Your Wishlist": user.wishlist });
};

module.exports = { addproducttowishlist, removefromwishlist, getwishlist };
