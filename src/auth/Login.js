import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", credentials);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(`👋 Welcome back, ${res.data.username}!`);
      navigate("/"); // redirect to homepage after login
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("❌ Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow-sm" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">🔐 Login</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="success" disabled={loading} className="w-100">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <p>
            Don’t have an account?{" "}
            <a href="/register" style={{ textDecoration: "none" }}>
              Register here
            </a>
          </p>
        </div>
      </Card>
    </Container>
  );
}

export default Login;
