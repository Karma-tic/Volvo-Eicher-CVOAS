const express = require("express");
const router = express.Router();
const StockMovement = require("../models/StockMovement");
const Stock = require("../models/Stock");

// RECORD stock movement (IN / OUT)
router.post("/", async (req, res) => {
  try {
    const { plantId, partId, type, quantity } = req.body;

    if (type === "OUT") {
      const stock = await Stock.findOne({ plantId, partId });
      if (!stock || stock.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      stock.quantity -= quantity;
      await stock.save();
    }

    if (type === "IN") {
      let stock = await Stock.findOne({ plantId, partId });
      if (stock) {
        stock.quantity += quantity;
        await stock.save();
      } else {
        await Stock.create({ plantId, partId, quantity });
      }
    }

    const movement = await StockMovement.create({
      plantId,
      partId,
      type,
      quantity,
    });

    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET movement history
router.get("/", async (req, res) => {
  try {
    const movements = await StockMovement.find()
      .populate("plantId", "name code")
      .populate("partId", "partName partCode")
      .sort({ createdAt: -1 });

    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
