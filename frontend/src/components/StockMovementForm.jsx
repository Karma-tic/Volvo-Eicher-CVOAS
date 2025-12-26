import { useState } from "react";

function StockMovementForm({ plants, parts, onSuccess }) {
  const [plantId, setPlantId] = useState("");
  const [partId, setPartId] = useState("");
  const [type, setType] = useState("IN");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!plantId || !partId || !quantity) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stock-movements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            plantId,
            partId,
            type,
            quantity: Number(quantity),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update stock");
      }

      setPlantId("");
      setPartId("");
      setQuantity("");
      onSuccess(); // reload dashboard data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-box">
      <h3>Update Inventory</h3>

      <form onSubmit={submitHandler} className="admin-form">
        <select value={plantId} onChange={(e) => setPlantId(e.target.value)}>
          <option value="">Select Plant</option>
          {plants.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={partId} onChange={(e) => setPartId(e.target.value)}>
          <option value="">Select Part</option>
          {parts.map((p) => (
            <option key={p._id} value={p._id}>
              {p.partName}
            </option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update Stock"}
        </button>
      </form>
    </div>
  );
}

export default StockMovementForm;
