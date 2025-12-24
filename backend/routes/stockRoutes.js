const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock");

// CREATE or UPDATE stock
router.post("/", async (req, res) => {
  try {
    const { plantId, partId, quantity } = req.body;

    let stock = await Stock.findOne({ plantId, partId });

    if (stock) {
      stock.quantity += quantity;
      await stock.save();
    } else {
      stock = await Stock.create({ plantId, partId, quantity });
    }

    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all stock
router.get("/", async (req, res) => {
  try {
    const stock = await Stock.find()
      .populate("plantId", "name code")
      .populate("partId", "partName partCode");
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
