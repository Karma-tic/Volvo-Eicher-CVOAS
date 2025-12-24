function App() {
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
          <p>Total Plants: 1</p>
          <p>Active Plant: Pithampur</p>
        </div>

        <div>
          <h2>Inventory Snapshot</h2>
          <p>Tracked Parts: 1</p>
          <p>Engine Stock: Available</p>
        </div>
      </section>
    </div>
  );
}

export default App;
