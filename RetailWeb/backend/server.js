require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Alert = require("./models/Alert");
const LiveSale = require("./models/LiveSale");
const DailySalesSummary = require("./models/DailySalesSummary");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

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
    io.emit("new-alert", savedAlert);
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

/* ================= WebSocket ================= */

io.on("connection", async (socket) => {
  console.log("🟢 Client connected");

  // ---- Live Sales ----
  const sendLiveSales = async () => {
    const sales = await LiveSale.find().sort({ time: -1 }).limit(10);

    socket.emit("live_sales", sales);
  };

  // ---- Daily Summary ----
  const sendDailySummary = async () => {
    const summary = await DailySalesSummary.findOne().sort({ date: -1 });

    socket.emit("daily_sales_summary", summary);
  };

  // Initial data send
  await sendLiveSales();
  await sendDailySummary();

  // Update every 5 seconds
  const interval = setInterval(async () => {
    await sendLiveSales();
    await sendDailySummary();
  }, 5000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("🔴 Client disconnected");
  });
});

/* ================= Start ================= */

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
