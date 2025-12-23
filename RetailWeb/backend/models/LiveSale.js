// models/LiveSale.js
const mongoose = require("mongoose");

const liveSaleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    Product: String,
    Qty: Number,
    Total: Number,
    Offer: String,
    Time: String,
  },
  { collection: "live_sales" }
);

module.exports = mongoose.model("LiveSale", liveSaleSchema);
