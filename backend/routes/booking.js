import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authmiddleware.js";
import { Place } from '../models/index.js';

const router = express.Router();

// Create a new booking
router.post("/", protect, async (req, res) => {
  try {
    const { placeId, carInfo, bookingDateTime } = req.body;
    const userId = req.user.id;

    if (!placeId || !carInfo || !bookingDateTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = await Booking.create({
      userId,
      placeId,
      carInfo,
      bookingDateTime,
      isPaid: false,           // default unpaid
      paymentMethod: null,     // not selected yet
    });

    // Return the booking including its ID
    res.status(201).json(newBooking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get bookings for logged-in user
router.get('/me', protect, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Place, attributes: ['id', 'name', 'location', 'description', 'photo'] }
      ],
    });
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get booking by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking (car info, datetime)
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this booking' });
    }

    const { carInfo, bookingDateTime } = req.body;
    if (!carInfo || !bookingDateTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    booking.carInfo = carInfo;
    booking.bookingDateTime = bookingDateTime;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await booking.destroy();
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
