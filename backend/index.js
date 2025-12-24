require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();
app.use(express.json());

// DB
connectDB();

app.use("/api/plants", require("./routes/plantRoutes"));
app.use("/api/parts", require("./routes/partRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));
app.use("/api/stock-movements", require("./routes/stockMovementRoutes"));

app.get("/", (req, res) => {
  res.send("Volvo–Eicher Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
