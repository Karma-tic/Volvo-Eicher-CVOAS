import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ ADD THIS

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);

    if (success) {
      navigate("/"); // ✅ REDIRECT TO DASHBOARD
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "360px",
          padding: "32px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(14px)",
          color: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Volvo–Eicher Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <motion.p
              initial={{ x: -8 }}
              animate={{ x: [-8, 8, -6, 6, 0] }}
              transition={{ duration: 0.4 }}
              style={{ color: "#ffb4b4", marginBottom: "12px" }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#22d3ee",
              color: "#002b36",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  outline: "none",
};

export default Login;
