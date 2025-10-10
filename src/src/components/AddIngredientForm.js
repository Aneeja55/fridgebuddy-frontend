import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Card } from "react-bootstrap";

function AddIngredientForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevents accidental GET request

    try {
      const response = await axios.post("http://localhost:8080/ingredients", {
        name,
        category,
        purchaseDate,
        expiryDate,
        status: "AVAILABLE", // backend expects this
        user: { id: 6 } // ✅ existing user ID from your MySQL "users" table
      });

      setMessage("✅ Ingredient added successfully!");
      console.log("Response:", response.data);

      // Reset form
      setName("");
      setCategory("");
      setPurchaseDate("");
      setExpiryDate("");

    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error adding ingredient.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "30rem", padding: "2rem" }}>
        <h3 className="text-center mb-4">Add Ingredient</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Add Ingredient
          </Button>
        </Form>

        {message && (
          <Alert
            variant={message.includes("Error") ? "danger" : "success"}
            className="mt-3 text-center"
          >
            {message}
          </Alert>
        )}
      </Card>
    </div>
  );
}

export default AddIngredientForm;
