import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Badge,
  Spinner,
  Card,
  Collapse,
} from "react-bootstrap";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotificationsBanner from "./NotificationsBanner";  

dayjs.extend(relativeTime);

function IngredientList() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [ingredients, setIngredients] = useState([]);
  const [highlightId, setHighlightId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExpired, setShowExpired] = useState(false); // ✅ For collapsible expired section

  // ✅ Fetch ingredients and notifications
  useEffect(() => {
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }

    fetchIngredients();
    fetchNotifications(); // 🔔 Fetch expiry notifications
  }, [userId]);

  const fetchIngredients = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/ingredients/${userId}`)
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
        );
        setIngredients(sorted);
        handleAutoExpire(sorted);
      })
      .catch((err) => {
        console.error("Error fetching ingredients:", err);
        toast.error("Failed to fetch ingredients.");
      })
      .finally(() => setLoading(false));
  };

  // ✅ Fetch notifications for items expiring soon
  const fetchNotifications = () => {
    axios
      .get(`http://localhost:8080/notifications/${userId}`)
      .then((res) => {
        if (res.data.length > 0) {
          res.data.forEach((n) =>
            toast.warning(`⚠️ ${n.message}`, { autoClose: 5000 })
          );
        }
      })
      .catch((err) =>
        console.error("Error fetching notifications:", err)
      );
  };

  // ✅ Highlight new ingredient temporarily
  useEffect(() => {
    const newId = localStorage.getItem("newIngredientId");
    if (newId) {
      setHighlightId(Number(newId));
      localStorage.removeItem("newIngredientId");
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, []);

  // ✅ Auto-mark expired items
  const handleAutoExpire = (items) => {
    const today = dayjs();
    items.forEach((item) => {
      const expiry = dayjs(item.expiryDate);
      if (expiry.isBefore(today) && item.status !== "EXPIRED") {
        axios
          .put(
            `http://localhost:8080/api/ingredients/${item.id}/status?status=EXPIRED`
          )
          .then(() => console.log(`Auto-marked ${item.name} as expired.`))
          .catch((err) =>
            console.error("Failed to auto-mark expired:", err)
          );
      }
    });
  };

  // ✅ Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ingredient?")) {
      axios
        .delete(`http://localhost:8080/api/ingredients/${id}`)
        .then(() => {
          toast.success("Ingredient deleted!");
          setIngredients((prev) => prev.filter((i) => i.id !== id));
        })
        .catch(() => toast.error("Failed to delete ingredient."));
    }
  };

  // ✅ Mark status (Used / Expired)
  const handleStatusUpdate = (id, status) => {
    axios
      .put(`http://localhost:8080/api/ingredients/${id}/status?status=${status}`)
      .then(() => {
        toast.info(`Ingredient marked as ${status}.`);
        setIngredients((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, status: status.toUpperCase() } : i
          )
        );
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        toast.error("Failed to update status.");
      });
  };

  const renderStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "EXPIRED":
        return <Badge bg="danger">Expired</Badge>;
      case "USED":
        return <Badge bg="secondary">Used</Badge>;
      default:
        return <Badge bg="success">Available</Badge>;
    }
  };

  // 🎨 Row color logic
  const getRowClass = (expiryDate) => {
    const expiry = dayjs(expiryDate);
    const today = dayjs();
    const daysUntilExpiry = expiry.diff(today, "day");

    if (daysUntilExpiry < 0) return "table-danger";
    if (daysUntilExpiry <= 1) return "table-danger";
    if (daysUntilExpiry <= 7) return "table-warning";
    return "";
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading your fridge...</p>
      </div>
    );
  }

  // 🧊 Separate expired vs active
  const activeItems = ingredients.filter((i) => i.status !== "EXPIRED");
  const expiredItems = ingredients.filter((i) => i.status === "EXPIRED");

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Your Ingredients</h3>
        <NotificationsBanner/>
      {/* 🌿 Active Ingredients */}
      <Card className="shadow-sm mb-5">
        <Card.Header as="h5" className="bg-success text-white">
          🥗 Active & Upcoming Ingredients
        </Card.Header>
        <Card.Body className="p-0">
          {activeItems.length > 0 ? (
            <div className="table-responsive">
              <Table bordered hover className="align-middle text-center m-0">
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
                  {activeItems.map((i) => (
                    <tr
                      key={i.id}
                      className={`${getRowClass(i.expiryDate)} ${
                        i.id === highlightId ? "row-glow" : ""
                      } fade-in-row`}
                    >
                      <td>{i.name}</td>
                      <td>{i.category}</td>
                      <td>{dayjs(i.purchaseDate).format("MMM D, YYYY")}</td>
                      <td>{dayjs(i.expiryDate).format("MMM D, YYYY")}</td>
                      <td>{renderStatusBadge(i.status)}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          {i.status !== "USED" && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleStatusUpdate(i.id, "USED")}
                            >
                              Mark Used
                            </Button>
                          )}
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => handleDelete(i.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-4 text-muted mb-0">
              No active ingredients. Add some fresh items! 🧺
            </p>
          )}
        </Card.Body>
      </Card>

      {/* ⚠️ Collapsible Expired Ingredients Section */}
      <Card className="shadow-sm">
        <Card.Header
          as="h5"
          className="bg-danger text-white d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => setShowExpired(!showExpired)}
        >
          ⚠️ Expired Ingredients
          <span style={{ fontSize: "1.2rem" }}>
            {showExpired ? "▲" : "▼"}
          </span>
        </Card.Header>
        <Collapse in={showExpired}>
          <div>
            <Card.Body className="p-0">
              {expiredItems.length > 0 ? (
                <div className="table-responsive">
                  <Table bordered hover className="align-middle text-center m-0">
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
                      {expiredItems.map((i) => (
                        <tr key={i.id} className="table-danger fade-in-row">
                          <td>{i.name}</td>
                          <td>{i.category}</td>
                          <td>{dayjs(i.purchaseDate).format("MMM D, YYYY")}</td>
                          <td>{dayjs(i.expiryDate).format("MMM D, YYYY")}</td>
                          <td>{renderStatusBadge(i.status)}</td>
                          <td>
                            <Button
                              variant="outline-dark"
                              size="sm"
                              onClick={() => handleDelete(i.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center py-4 text-muted mb-0">
                  No expired ingredients. Great job! 🌱
                </p>
              )}
            </Card.Body>
          </div>
        </Collapse>
      </Card>
    </div>
  );
}

export default IngredientList;
