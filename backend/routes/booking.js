import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authmiddleware.js";


const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { carInfo, bookingDateTime } = req.body;
    const userId = req.user.id;

    if (!carInfo || !bookingDateTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = await Booking.create({
      userId,
      carInfo,
      bookingDateTime,
    });

    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
