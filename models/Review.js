const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
