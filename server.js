// =======================
// Load env FIRST
// =======================
require("dotenv").config();

// =======================
// Imports
// =======================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const todoRoutes = require("./routes/todoRoutes");

// =======================
// App init
// =======================
const app = express();

// =======================
// Security Middlewares
// =======================
app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev URL
    credentials: true,
  })
);

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Try again later.",
  })
);

// =======================
// Body parser
// =======================
app.use(express.json());

// =======================
// Database
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// =======================
// Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/admin", adminRoutes);

// =======================
// Health check
// =======================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =======================
// Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
