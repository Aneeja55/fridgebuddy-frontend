import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      // ✅ Save user info locally (for persistent login)
      localStorage.setItem("user", JSON.stringify(response.data));

      alert(`Welcome ${response.data.username}!`);
      navigate("/"); // redirect to home
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>

      <p className="text-center mt-3">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
