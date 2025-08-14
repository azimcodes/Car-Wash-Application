import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Car from '../models/Car.js';
import { User } from '../models/index.js'; // Import User model for association

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { make, model, year, color } = req.body;
    const userId = req.user.id;
    if (!make || !model || !year || !color) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Create a new car entry
    const newCar = await Car.create({
      userId,
      make,
      model,
      year,
      color
    });

    res.status(201).json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch all cars associated with the user
    const cars = await Car.findAll({
      where: { userId },
    });
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', protect, async (req,res)=>{
  try{
    const  id  = req.params.id;
    const car  = await Car.findByPk(id);
    if(!car){
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(car);
  } catch(err){
     console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const id  = req.params.id;
    const { make, model, year, color } = req.body;
    // Find the car by ID
    const car = await Car.findByPk(id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Update the car details
    car.make = make;
    car.model = model;
    car.year = year;
    car.color = color;
    await car.save();

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    // Find the car by ID
    const car = await Car.findByPk(id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Delete the car
    await car.destroy();
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;