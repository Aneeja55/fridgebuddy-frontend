import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import { getCurrentUser } from "../utils/auth";
import dayjs from "dayjs";
import { useToast } from "./ToastContext";

function AddIngredientForm() {
  const { showToast } = useToast();
  const user = getCurrentUser();
  const today = dayjs().format("YYYY-MM-DD");
  const userId = user?.id;

  const [ingredient, setIngredient] = useState({
    user: { id: userId },
    name: "",
    category: "",
    purchaseDate: today,
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setIngredient({ ...ingredient, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`http://localhost:8080/api/ingredients`, ingredient)
      .then((res) => {
        showToast("✅ Ingredient added successfully!", "success");
        localStorage.setItem("newIngredientId", res.data.id);
        setTimeout(() => (window.location.href = "/"), 1000);
      })
      .catch(() => showToast("❌ Failed to add ingredient.", "danger"))
      .finally(() => setLoading(false));
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h3 className="text-center mb-4">Add New Ingredient</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={ingredient.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control name="category" value={ingredient.category} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control type="date" name="purchaseDate" value={ingredient.purchaseDate} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control type="date" name="expiryDate" value={ingredient.expiryDate} onChange={handleChange} required />
          </Form.Group>
          <div className="text-center">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? <><Spinner animation="border" size="sm" /> Adding...</> : "+ Add Ingredient"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default AddIngredientForm;
