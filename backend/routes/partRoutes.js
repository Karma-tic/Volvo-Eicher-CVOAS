const express = require("express");
const router = express.Router();
const Part = require("../models/Part");

// CREATE part
router.post("/", async (req, res) => {
  try {
    const part = await Part.create(req.body);
    res.status(201).json(part);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all parts
router.get("/", async (req, res) => {
  try {
    const parts = await Part.find();
    res.json(parts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
