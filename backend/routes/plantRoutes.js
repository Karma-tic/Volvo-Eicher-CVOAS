const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");

// CREATE plant
router.post("/", async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json(plant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
