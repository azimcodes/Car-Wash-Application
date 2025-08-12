import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import path from "path";
import { fileURLToPath } from "url";
import placeRoutes from "./routes/place.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS in /public)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use('/uploads', express.static(path.join(__dirname, "../frontend/uploads"))); // Serve uploaded files
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/places", placeRoutes);

// Start server
const PORT =  5001;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
