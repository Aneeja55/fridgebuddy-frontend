import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        username,
        password,
      });
      alert(response.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try another username.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleRegister}>
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
          Register
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
