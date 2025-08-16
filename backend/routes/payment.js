import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Pay at Place
router.post("/pay-later", protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.isPaid = false;
    booking.paymentMethod = "pay_at_place";
    await booking.save();

    res.json({ message: "Payment method updated to Pay at Place", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment update failed" });
  }
});

// Pay Now (simulate payment)
router.post("/pay-now", protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.isPaid = true;
    booking.paymentMethod = "pay_now";
    await booking.save();

    // If you want real payment gateway, return checkoutUrl here
    res.json({ message: "Payment completed", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment update failed" });
  }
});

export default router;
