import { useEffect, useState } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [parts, setParts] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plants`)
    .then((res) => res.json())
    .then((data) => setPlants(data))
    .catch((err) => console.error(err));

  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/parts`)
    .then((res) => res.json())
    .then((data) => setParts(data))
    .catch((err) => console.error(err));

  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock`)
    .then((res) => res.json())
    .then((data) => setStock(data))
    .catch((err) => console.error(err));

}, []);

  

  return (
    <div className="glass">
      <h1>Volvo–Eicher Operations Dashboard</h1>

      <section
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        <div>
          <h2>Plant Overview</h2>
          <p>Total Plants: {plants.length > 0 ? plants.length : "Loading..."}</p>

          <p>
            Active Plant:{" "}
            {plants.length > 0 ? plants[0].name : "Loading..."}
          </p>
        </div>

        <div>
          <h2>Inventory Snapshot</h2>
          <p>Tracked Parts: {parts.length}</p>
          <p>
  Total Stock Quantity:{" "}
  {stock.length > 0
    ? stock.reduce((sum, item) => sum + item.quantity, 0)
    : "Loading..."}
</p>

        </div>
      </section>
    </div>
  );
}

export default App;
