import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", user);
      toast.success(`🎉 User "${res.data.username}" registered successfully!`);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("❌ Registration failed. Username might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow-sm" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">🧾 Register</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter a unique username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter a secure password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="primary" disabled={loading} className="w-100">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <a href="/login" style={{ textDecoration: "none" }}>
              Login here
            </a>
          </p>
        </div>
      </Card>
    </Container>
  );
}

export default Register;
