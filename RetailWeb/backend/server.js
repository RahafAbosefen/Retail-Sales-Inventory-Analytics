require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Alert = require("./models/Alert");
const LiveSale = require("./models/LiveSale");
const DailySalesSummary = require("./models/DailySalesSummary");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect("mongodb://localhost:27017/inventory_db")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ================= API  ================= */

// Alerts
app.get("/api/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/alerts", async (req, res) => {
  try {
    const alert = new Alert(req.body);
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Inventory Recommendations
app.get("/api/recommendations", async (req, res) => {
  try {
    const alerts = await Alert.find({
      Suggested_Order_Qty: { $exists: true },
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Daily Sales Summary
app.get("/api/daily_sales_summary", async (req, res) => {
  try {
    const summary = await DailySalesSummary.findOne().sort({ date: -1 });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Live Sales
app.get("/api/live_sales", async (req, res) => {
  try {
    const sales = await LiveSale.find().sort({ time: -1 }).limit(100);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= Start ================= */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
