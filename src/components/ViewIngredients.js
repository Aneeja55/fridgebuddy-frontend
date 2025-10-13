import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Spinner,
  Card,
  Modal,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationsBanner from "./NotificationsBanner";

function ViewIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const userId = 6; // static user

  // ✅ Fetch and sort ingredients by expiry date
  const fetchIngredients = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/ingredients/${userId}`)
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        );
        setIngredients(sorted);
      })
      .catch((err) => {
        console.error("Error fetching ingredients:", err);
        toast.error("❌ Failed to fetch ingredients", { position: "top-right" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // ✅ Update ingredient status (USED / EXPIRED)
  const updateStatus = (id, status) => {
    axios
      .put(`http://localhost:8080/ingredients/${id}/status?status=${status}`)
      .then(() => {
        toast.success(`✅ Ingredient marked as ${status}`, {
          position: "top-right",
        });
        fetchIngredients();
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        toast.error("❌ Failed to update status", { position: "top-right" });
      });
  };

  // ✅ Open confirmation modal before deletion
  const confirmDelete = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowModal(true);
  };

  // ✅ Delete ingredient
  const deleteIngredient = () => {
    if (!selectedIngredient) return;

    axios
      .delete(`http://localhost:8080/ingredients/${selectedIngredient.id}`)
      .then(() => {
        toast.success("🗑 Ingredient deleted successfully!", {
          position: "top-right",
        });
        setShowModal(false);
        setSelectedIngredient(null);
        fetchIngredients();
      })
      .catch((err) => {
        console.error("Error deleting ingredient:", err);
        toast.error("❌ Failed to delete ingredient!", {
          position: "top-right",
        });
      });
  };

  // ✅ Loading spinner
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading your ingredients...</p>
      </Container>
    );
  }

  // ✅ Main UI
  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4">
        <h3 className="text-center mb-4">Your Ingredients</h3>

        {/* Notifications banner */}
        <NotificationsBanner />

        <Table bordered hover responsive className="align-middle text-center">
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
                        onClick={() => confirmDelete(item)}
                      >
                        🗑 Delete
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

      {/* ✅ Deletion confirmation modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedIngredient?.name}</strong>? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteIngredient}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ViewIngredients;
