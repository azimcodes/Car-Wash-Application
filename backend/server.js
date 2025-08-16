import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";

// Import models here so Sequelize knows about them
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import Place from "./models/Place.js";
import Car from "./models/Car.js";

import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import placeRoutes from "./routes/place.js";
import carRoutes from "./routes/car.js";
import paymentRoutes from "./routes/payment.js";

import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use('/uploads', express.static(path.join(__dirname, "../frontend/uploads"))); // Serve uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/car", carRoutes);

app.use("/api/payments", paymentRoutes);

// Start server and sync database
const PORT = 5001;

// Only one sync call. Use force: true if you want to reset tables (dev only)
sequelize.sync({ force: false })  // change to true if you want to drop and recreate
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
  });
