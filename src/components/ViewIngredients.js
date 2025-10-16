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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const userId = 6;

  // ✅ Fetch ingredients
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
      .catch((err) => console.error("Error fetching ingredients:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // ✅ Update status
  const updateStatus = (id, status) => {
    axios
      .put(`http://localhost:8080/ingredients/${id}/status?status=${status}`)
      .then(() => {
        alert(`Ingredient marked as ${status}`);
        fetchIngredients();
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Failed to update status.");
      });
  };

  // ✅ Delete ingredient
  const deleteIngredient = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      axios
        .delete(`http://localhost:8080/ingredients/${id}`)
        .then(() => {
          alert(`${name} deleted successfully.`);
          fetchIngredients();
        })
        .catch((err) => {
          console.error("Error deleting ingredient:", err);
          alert("Failed to delete ingredient.");
        });
    }
  };

  // ✅ Apply filter & search
  const filteredIngredients = ingredients.filter((item) => {
    const matchesFilter =
      filter === "ALL" || item.status === filter.toUpperCase();
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

        {/* ✅ Filter + Search Bar */}
        <Row className="align-items-center mb-4">
          <Col md={3} sm={12} className="mb-2">
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="AVAILABLE">Available</option>
              <option value="EXPIRED">Expired</option>
              <option value="USED">Used</option>
            </Form.Select>
          </Col>

          <Col md={6} sm={12} className="mb-2">
            <Form.Control
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col md={3} sm={12} className="text-md-end text-center">
            <Button variant="success" href="/add">
              + Add New Ingredient
            </Button>
          </Col>
        </Row>

        {/* ✅ Ingredient Table */}
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
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map((item) => (
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
                  No ingredients found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default ViewIngredients;
