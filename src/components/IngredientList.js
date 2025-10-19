import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";

function IngredientList() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }

    axios
      .get(`http://localhost:8080/api/ingredients/${userId}`)
      .then((res) => setIngredients(res.data))
      .catch((err) => {
        console.error("Error fetching ingredients:", err);
        toast.error("Failed to fetch ingredients.");
      });
  }, [userId]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ingredient?")) {
      axios
        .delete(`http://localhost:8080/api/ingredients/${id}`)
        .then(() => {
          toast.success("Ingredient deleted!");
          setIngredients(ingredients.filter((i) => i.id !== id));
        })
        .catch(() => toast.error("Failed to delete ingredient."));
    }
  };

  return (
    <div className="table-responsive">
  <Table striped bordered hover className="align-middle text-center">
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Purchase Date</th>
        <th>Expiry Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {ingredients.map((i) => (
        <tr key={i.id}>
          <td>{i.name}</td>
          <td>{i.category}</td>
          <td>{i.purchaseDate}</td>
          <td>{i.expiryDate}</td>
          <td>{i.status}</td>
          <td>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Button variant="danger" onClick={() => handleDelete(i.id)}>
                Delete
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>
  );
}

export default IngredientList;
