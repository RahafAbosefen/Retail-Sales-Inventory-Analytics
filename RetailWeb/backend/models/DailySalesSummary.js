// models/DailySalesSummary.js
const mongoose = require("mongoose");

const dailySalesSummarySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: Date,
    total_orders: Number,
    total_items_sold: Number,
    total_sales: Number,
    average_order_value: Number,
  },
  { collection: "daily_sales_summary" }
);

module.exports = mongoose.model("DailySalesSummary", dailySalesSummarySchema);
