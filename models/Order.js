const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: { type: String, required: true },
  count: {
    type: Number,
  },
  orderedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  orderstatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Cash On Delivery", "Canceled", "Failed"],
  },
});

module.exports = mongoose.model("Order", orderSchema);
