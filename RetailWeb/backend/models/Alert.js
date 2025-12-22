const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  Product: { type: String, required: true },
  Type: { type: String, required: true },
  Stock: { type: Number, required: true },
  Offer: String,
  Inventory_State: String,
  Behavior_Analysis: String,
  Suggested_Order_Qty: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", alertSchema);
