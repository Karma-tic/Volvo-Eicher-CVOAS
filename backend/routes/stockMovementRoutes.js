const express = require("express");
const router = express.Router();
const StockMovement = require("../models/StockMovement");
const Stock = require("../models/Stock");
const { protect, authorize } = require("../middleware/authMiddleware");

// ===============================
// RECORD stock movement (IN / OUT)
// ===============================
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  async (req, res) => {
    try {
      const { plantId, partId, type, quantity } = req.body;

      if (!plantId || !partId || !type || !quantity) {
        return res.status(400).json({ message: "Missing required fields" });
      }

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

      // ✅ SOCKET.IO EMIT (SAFE)
      const io = req.app.get("io");
      if (io) {
        io.emit("stock:update", {
          type,
          quantity,
          plantId,
          partId,
          createdAt: movement.createdAt,
        });
      }

      res.status(201).json(movement);
    } catch (error) {
      console.error("Stock movement error:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

// ===============================
// GET movement history (protected)
// ===============================
router.get(
  "/",
  protect,
  authorize("admin", "manager"),
  async (req, res) => {
    try {
      const movements = await StockMovement.find()
        .populate("plantId", "name code")
        .populate("partId", "partName partCode")
        .sort({ createdAt: -1 });

      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
