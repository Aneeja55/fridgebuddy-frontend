import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getCurrentUser } from "../utils/auth";

function AddIngredientForm() {
  const user = getCurrentUser();
  const userId = user?.id;
  const [ingredient, setIngredient] = useState({
    user: { id: userId }, // ✅ Static user ID (for now)
    name: "",
    category: "",
    purchaseDate: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setIngredient({ ...ingredient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`http://localhost:8080/api/ingredients`, ingredient)
      .then(() => {
        toast.success("✅ Ingredient added successfully!");
        setTimeout(() => (window.location.href = "/"), 1000);
        
      })
      .catch((err) => {
        console.error("Error adding ingredient:", err);
        toast.error("❌ Failed to add ingredient. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h3 className="text-center mb-4">Add New Ingredient</h3>

        <Form onSubmit={handleSubmit} className="p-2 p-md-3">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter ingredient name"
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
              placeholder="e.g. Dairy, Snack, Meat"
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
            <Button  type="submit"  variant="success"  className="w-100 w-md-auto"  disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Adding...
                </>
              ) : (
                "+ Add Ingredient"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default AddIngredientForm;
