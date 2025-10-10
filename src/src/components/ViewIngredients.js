import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";

function ViewIngredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/ingredients/6") // userId = 1 for now
      .then((res) => setIngredients(res.data))
      .catch((err) => console.error("Error fetching ingredients:", err));
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-center">Your Ingredients</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Purchase Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length > 0 ? (
            ingredients.map((item) => (
              <tr
                key={item.id}
                className={
                  new Date(item.expiryDate) <= new Date()
                    ? "table-danger"
                    : ""
                }
              >
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.purchaseDate}</td>
                <td>{item.expiryDate}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No ingredients found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="text-center">
        <Button variant="success" href="/add">+ Add New</Button>
      </div>
    </Container>
  );
}

export default ViewIngredients;
