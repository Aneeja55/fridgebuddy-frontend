import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Spinner,
  Card,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import NotificationsBanner from "./NotificationsBanner";

function ViewIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const userId = 6;
  

  // ✅ Fetch all ingredients and sort by expiry date (soonest first)
  const fetchIngredients = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/ingredients/${userId}`)
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        );
        setIngredients(sorted);
        setFiltered(sorted);
      })
      .catch((err) => console.error("Error fetching ingredients:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // ✅ Filter by status
  useEffect(() => {
    if (filterStatus === "ALL") setFiltered(ingredients);
    else setFiltered(ingredients.filter((i) => i.status === filterStatus));
  }, [filterStatus, ingredients]);

  // ✅ Update status (USED / EXPIRED)
  const updateStatus = (id, status) => {
    axios
      .put(`http://localhost:8080/ingredients/${id}/status?status=${status}`)
      .then(() => {
        alert(`✅ Ingredient marked as ${status}`);
        fetchIngredients(); // automatically re-sorts
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("❌ Failed to update status.");
      });
  };

  // ✅ Delete ingredient with confirmation
  const deleteIngredient = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      axios
        .delete(`http://localhost:8080/ingredients/${id}`)
        .then(() => {
          alert(`🗑️ "${name}" deleted successfully`);
          fetchIngredients(); // automatically re-sorts
        })
        .catch((err) => {
          console.error("Error deleting ingredient:", err);
          alert("❌ Failed to delete ingredient.");
        });
    }
  };

// Add this helper function near the top of ViewIngredients.js
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


  // ✅ Determine row color dynamically
  const getRowClass = (item) => {
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (item.status === "EXPIRED") return "table-danger";
    if (item.status === "USED") return "table-secondary";
    if (diffDays <= 2 && diffDays >= 0) return "table-warning"; // expiring soon
    return "";
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

        {/* ✅ Expiry alerts */}
        <NotificationsBanner />

        {/* ✅ Filter Controls */}
        <Row className="align-items-center mb-3">
          <Col md={6}>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Show All</option>
              <option value="AVAILABLE">Available</option>
              <option value="USED">Used</option>
              <option value="EXPIRED">Expired</option>
            </Form.Select>
          </Col>
          <Col md={6} className="text-md-end text-center mt-2 mt-md-0">
            <Button variant="success" href="/add">
              + Add New Ingredient
            </Button>
          </Col>
        </Row>

        {/* ✅ Table */}
        <div className="table-responsive mt-3">
          <Table striped bordered hover className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Purchase Date</th>
                <th>Expiry Date ⏳</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className={getRowClass(item)}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{formatDate(item.purchaseDate)}</td>
                    <td>{formatDate(item.expiryDate)}</td>
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
                  <td colSpan="6" className="text-center py-4">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/7656/7656139.png"
                      alt="Empty fridge"
                      style={{ width: "80px", opacity: 0.7 }}
                    />
                    <p className="mt-3 mb-0 fw-semibold">Your fridge is empty!</p>
                    <p className="text-muted">Add your first ingredient to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
}

export default ViewIngredients;
