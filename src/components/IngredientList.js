import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Badge, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function IngredientList() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [ingredients, setIngredients] = useState([]);
  const [highlightId, setHighlightId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch ingredients
  useEffect(() => {
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }

    axios
      .get(`http://localhost:8080/api/ingredients/${userId}`)
      .then((res) => {
        const data = res.data;
        setIngredients(data);
        handleAutoExpire(data);
      })
      .catch((err) => {
        console.error("Error fetching ingredients:", err);
        toast.error("Failed to fetch ingredients.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // ✅ Highlight the newly added ingredient
  useEffect(() => {
    const newId = localStorage.getItem("newIngredientId");
    if (newId) {
      setHighlightId(Number(newId));
      localStorage.removeItem("newIngredientId");
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, []);

  // ✅ Auto-mark expired ingredients
  const handleAutoExpire = (ingredients) => {
    const today = dayjs();
    ingredients.forEach((item) => {
      const expiry = dayjs(item.expiryDate);
      if (expiry.isBefore(today) && item.status !== "EXPIRED") {
        axios
          .put(
            `http://localhost:8080/api/ingredients/${item.id}/status?status=EXPIRED`
          )
          .then(() => {
            console.log(`Auto-marked ${item.name} as expired.`);
          })
          .catch((err) =>
            console.error("Failed to auto-mark expired item:", err)
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
          setIngredients(ingredients.filter((i) => i.id !== id));
        })
        .catch(() => toast.error("Failed to delete ingredient."));
    }
  };

  // ✅ Update status manually (mark used)
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

  // ✅ Render colored badge
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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading your fridge...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Your Ingredients</h3>
      <div className="table-responsive">
        <Table striped bordered hover className="align-middle text-center">
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
            {ingredients.map((i) => {
              const expiry = dayjs(i.expiryDate);
              const today = dayjs();
              const daysUntilExpiry = expiry.diff(today, "day");

              // 🎨 Row color logic
              let rowClass = "";
              if (daysUntilExpiry < 0) {
                rowClass = "table-danger"; // expired
              } else if (daysUntilExpiry <= 1) {
                rowClass = "table-danger"; // expires today/tomorrow
              } else if (daysUntilExpiry <= 7) {
                rowClass = "table-warning"; // expiring soon
              }

              return (
                <tr
                  key={i.id}
                  className={`${rowClass} ${
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
                      {i.status !== "USED" && i.status !== "EXPIRED" && (
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
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default IngredientList;
