import express from "express";
import Place from "../models/Place.js";
import { protect } from "../middleware/authmiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import isAdmin from "../middleware/isAdmin.js";
// Setup multer storage and filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../frontend/uploads")); // adjust to your frontend uploads folder
  },
  filename: (req, file, cb) => {
    // Unique filename with timestamp and original name
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

const upload = multer({ storage });

const router = express.Router();

// POST create new place (admin only, protected)
router.post("/", protect, isAdmin, upload.single("photo"), async (req, res) => {
  try {
    const { name, address, phone, description, availability, location, isOpen } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address required" });
    }
    console.log(req.body);
    console.log(req.file);

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const newPlace = await Place.create({
      name,
      address,
      phone,
      description,
      availability,
      location,
      isOpen: isOpen === "true" || isOpen === true,
      photo,
    });

    res.status(201).json(newPlace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// filepath: /Users/azim/Desktop/Wash-Car APP/backend/app.js
router.get("/", protect, async (req, res) => {
  try {
    const places = await Place.findAll();
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", protect, async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Place.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: "Place deleted" });
    } else {
      res.status(404).json({ message: "Place not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", protect, async (req, res) => {
  try {
    const id = req.params.id;
    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", protect, upload.single("photo"), async (req, res) => {
  try {
    const id = req.params.id;
    const { name, address, phone, description, availability, location } = req.body;
    const place = await Place.findByPk(id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    place.name = name;
    place.address = address;
    place.phone = phone;
    place.description = description;
    place.availability = availability;
    place.location = location;
    if (req.file) {
      place.photo = `/uploads/${req.file.filename}`;
    }

    await place.save();
    res.json({ message: "Place updated", place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
