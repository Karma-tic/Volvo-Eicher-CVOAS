require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/**
 * Make socket available everywhere
 * (routes can access via req.app.get("io"))
 */
app.set("io", io);

/* ---------------- DB ---------------- */
connectDB();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/plants", require("./routes/plantRoutes"));
app.use("/api/parts", require("./routes/partRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));
app.use("/api/stock-movements", require("./routes/stockMovementRoutes"));

/* ---------------- SOCKET EVENTS ---------------- */
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Volvo–Eicher Backend Running");
});

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
