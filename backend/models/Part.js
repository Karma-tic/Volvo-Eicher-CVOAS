const mongoose = require("mongoose");

const partSchema = new mongoose.Schema(
  {
    partName: {
      type: String,
      required: true,
    },
    partCode: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Part", partSchema);
