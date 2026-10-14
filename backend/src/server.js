import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Base & Health Check Endpoints (Preserved)
app.get("/", (req, res) => {
  res.json({
    message: "Backend Portal Digital TI UNUSIA berjalan!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "REST API berjalan dengan baik",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DATABASE() AS database_name"
    );

    res.json({
      success: true,
      message: "Koneksi MySQL berhasil",
      database: rows[0].database_name,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Koneksi MySQL gagal",
    });
  }
});

// Modular REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/academic-services", serviceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin", adminRoutes);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});