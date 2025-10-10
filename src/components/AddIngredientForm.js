import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";

function AddIngredientForm() {
  const [ingredient, setIngredient] = useState({
    name: "",
    category: "",
    purchaseDate: "",
    expiryDate: "",
    status: "AVAILABLE",
    user: { id: 6 },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredient({ ...ingredient, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/ingredients", ingredient)
      .then(() => {
        alert("Ingredient added successfully!");
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Error adding ingredient:", err);
        alert("Failed to add ingredient.");
      });
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h3 className="text-center mb-4">Add New Ingredient</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={ingredient.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={ingredient.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              type="date"
              name="purchaseDate"
              value={ingredient.purchaseDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="date"
              name="expiryDate"
              value={ingredient.expiryDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit">
              Add Ingredient
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default AddIngredientForm;
