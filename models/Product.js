const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Provide A Title for The Product"],
  },
  description: {
    type: String,
    required: [true, "Please Provide A Title for The Product"],
    minlength: 10,
  },
  rating: {
    type: Number,
    default: null,
  },
  price: {
    type: Number,
    required: [true, "Please Set The Product Price"],
  },
  images: {
    type: Array,
  },
  category: {
    type: [String],
    required: true,
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
  color: {
    type: String,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
