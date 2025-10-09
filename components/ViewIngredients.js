import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner } from "react-bootstrap";
import NotificationsBanner from "./NotificationsBanner";

function ViewIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 6; // ✅ Update this if you log in dynamically later

  // Fetch ingredients
  const fetchIngredients = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/ingredients/${userId}`)
      .then((res) => setIngredients(res.data))
      .catch((err) => console.error("Error fetching ingredients:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // ✅ Update status of ingredient (USED / EXPIRED)
  const updateStatus = (id, status) => {
    axios
      .put(`http://localhost:8080/ingredients/${id}/status?status=${status}`)
      .then(() => {
        alert(`Ingredient marked as ${status}`);
        fetchIngredients(); // Refresh after update
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Failed to update status.");
      });
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading ingredients...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-center">Your Ingredients</h3>
      <NotificationsBanner />

      <Table striped bordered hover responsive>
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
          {ingredients.length > 0 ? (
            ingredients.map((item) => (
              <tr
                key={item.id}
                className={
                  item.status === "EXPIRED"
                    ? "table-danger"
                    : item.status === "USED"
                    ? "table-secondary"
                    : new Date(item.expiryDate) <= new Date()
                    ? "table-warning"
                    : ""
                }
              >
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.purchaseDate}</td>
                <td>{item.expiryDate}</td>
                <td>{item.status}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => updateStatus(item.id, "USED")}
                  >
                    Mark Used
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => updateStatus(item.id, "EXPIRED")}
                  >
                    Mark Expired
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No ingredients found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="text-center mt-3">
        <Button variant="success" href="/add">
          + Add New
        </Button>
      </div>
    </Container>
  );
}

export default ViewIngredients;
