import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import StockMovementForm from "./components/StockMovementForm";

function App() {
  const { user, logout } = useAuth();

  // ---------------- STATE ----------------
  const [plants, setPlants] = useState([]);
  const [parts, setParts] = useState([]);
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // ---------------- FETCH ALL DATA ----------------
  const fetchAll = async () => {
  try {
    const [pRes, paRes, sRes, mRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plants`, { headers: authHeaders }),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/parts`, { headers: authHeaders }),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock`, { headers: authHeaders }),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock-movements`, { headers: authHeaders }),
    ]);

    const plantsData = await pRes.json();
    const partsData = await paRes.json();
    const stockData = await sRes.json();
    const movementsData = await mRes.json();

    setPlants(Array.isArray(plantsData) ? plantsData : []);
    setParts(Array.isArray(partsData) ? partsData : []);
    setStock(Array.isArray(stockData) ? stockData : []);
    setMovements(Array.isArray(movementsData) ? movementsData : []);
  } catch (err) {
    console.error("Fetch error:", err);
    setPlants([]);
    setParts([]);
    setStock([]);
    setMovements([]);
  }
};


  useEffect(() => {
    fetchAll();
  }, []);

  // ---------------- SOCKET LIVE UPDATES ----------------
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL);

    socket.on("stock:update", () => {
      fetchAll();
    });

    return () => socket.disconnect();
  }, []);

  // ---------------- KPI ----------------
  const totalStockQty =
    stock.length > 0
      ? stock.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

  // ---------------- CHART ----------------
  const sortedMovements = [...movements].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  let runningTotal = 0;
  const chartData = sortedMovements.map((m) => {
    runningTotal += m.type === "IN" ? m.quantity : -m.quantity;
    return {
      time: new Date(m.createdAt).toLocaleDateString(),
      stockLevel: runningTotal,
    };
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["admin", "manager", "viewer"]}>
              <div className="glass">

                {/* HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >
                  <h1>Volvo–Eicher Operations Dashboard</h1>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.18)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {user?.role?.toUpperCase()}
                    </span>

                    <button
                      onClick={logout}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.25)",
                        background: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* KPI */}
                <section className="kpi-grid">
                  <div className="kpi">
                    <h2>Plant Overview</h2>
                    <p>Total Plants: {plants.length}</p>
                    <p>Active Plant: {plants[0]?.name || "—"}</p>
                  </div>

                  <div className="kpi">
                    <h2>Inventory Snapshot</h2>
                    <p>Tracked Parts: {parts.length}</p>
                    <p>Total Stock Quantity: {totalStockQty}</p>
                  </div>
                </section>

                {/* ADMIN STOCK ENTRY */}
                {user?.role === "admin" && (
                  <StockMovementForm
                    plants={plants}
                    parts={parts}
                    onSuccess={fetchAll}
                  />
                )}

                {/* CHART */}
                <section style={{ marginTop: "26px" }}>
                  <h2>Inventory Movement Trend</h2>

                  {chartData.length === 0 ? (
                    <p style={{ marginTop: "10px" }}>No chart data yet</p>
                  ) : (
                    <div style={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer>
                        <LineChart data={chartData}>
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="stockLevel"
                            stroke="#22d3ee"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </section>

                {/* TABLE */}
                <section className="table-wrap">
                  <h2>Stock Movement Audit Trail</h2>

                  <div
  style={{
    maxHeight: "180px", // ~3 rows visible
    overflowY: "auto",
    marginTop: "10px",
    borderRadius: "10px",
  }}
>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>

                      <thead
  style={{
    position: "sticky",
    top: 0,
    background: "rgba(60, 70, 90, 0.95)",
    zIndex: 2,
  }}
>

                        <tr>
                          <th align="left">Plant</th>
                          <th align="left">Part</th>
                          <th align="center">Type</th>
                          <th align="right">Qty</th>
                          <th align="right">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movements.length === 0 ? (
                          <tr key={m._id} style={{ height: "42px" }}>

                            <td colSpan="5" style={{ textAlign: "center" }}>
                              No movements recorded
                            </td>
                          </tr>
                        ) : (
                          movements.map((m) => (
                            <tr key={m._id}>
                              <td>{m.plantId?.name || "—"}</td>
                              <td>{m.partId?.partName || "—"}</td>
                              <td align="center">
                                <span
                                  className={`pill ${
                                    m.type === "IN" ? "in" : "out"
                                  }`}
                                >
                                  {m.type}
                                </span>
                              </td>
                              <td align="right">{m.quantity}</td>
                              <td align="right">
                                {new Date(m.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
