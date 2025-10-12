import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Spinner, Card } from "react-bootstrap";
import NotificationsBanner from "./NotificationsBanner";
import { useToast } from "./ToastContext";

function ViewIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 6;
  const { showToast } = useToast();

  const fetchIngredients = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/ingredients/${userId}`)
      .then((res) => {
        // Sort by expiry date (soonest first)
        const sorted = res.data.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        );
        setIngredients(sorted);
      })
      .catch((err) => console.error("Error fetching ingredients:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // ✅ Update status (USED / EXPIRED)
  const updateStatus = (id, status) => {
    axios
      .put(`http://localhost:8080/ingredients/${id}/status?status=${status}`)
      .then(() => {
        showToast(`Ingredient marked as ${status}`, "info");
        fetchIngredients();
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        showToast("Failed to update status.", "danger");
      });
  };

  // ✅ Delete ingredient with confirmation
  const deleteIngredient = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      axios
        .delete(`http://localhost:8080/ingredients/${id}`)
        .then(() => {
          showToast(`"${name}" deleted successfully.`, "success");
          fetchIngredients();
        })
        .catch((err) => {
          console.error("Error deleting ingredient:", err);
          showToast("Failed to delete ingredient.", "danger");
        });
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading your ingredients...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h3 className="text-center mb-4">Your Ingredients</h3>
        <NotificationsBanner />

        <Table bordered hover className="align-middle text-center">
          <thead className="table-dark">
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
                  <td>
                    <strong>{item.status}</strong>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => updateStatus(item.id, "USED")}
                        disabled={item.status === "USED"}
                      >
                        Mark Used
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => updateStatus(item.id, "EXPIRED")}
                        disabled={item.status === "EXPIRED"}
                      >
                        Mark Expired
                      </Button>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => deleteIngredient(item.id, item.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3">
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
      </Card>
    </Container>
  );
}

export default ViewIngredients;
