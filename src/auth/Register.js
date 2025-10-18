import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";
import { toast } from "react-toastify";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/auth/register", { username, password })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Account created successfully!");
        window.location.href = "/";
      })
      .catch(() => toast.error("Username already exists"));
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h3 className="text-center mb-3">Register</h3>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default Register;
