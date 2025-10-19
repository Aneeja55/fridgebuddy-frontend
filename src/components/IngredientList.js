import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function IngredientList() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [ingredients, setIngredients] = useState([]);
  const [highlightId, setHighlightId] = useState(null);

  // ✅ Fetch ingredients for logged-in user
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

  // ✅ Highlight the newly added ingredient
  useEffect(() => {
    const newId = localStorage.getItem("newIngredientId");
    if (newId) {
      setHighlightId(Number(newId));
      localStorage.removeItem("newIngredientId");
      setTimeout(() => setHighlightId(null), 3000);
    }
  }, []);

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

              // 🎨 Color logic
              let rowClass = "";
              if (daysUntilExpiry < 0) {
                rowClass = "table-danger"; // expired
              } else if (daysUntilExpiry <= 1) {
                rowClass = "table-danger"; // expires today/tomorrow
              } else if (daysUntilExpiry <= 7) {
                rowClass = "table-warning"; // expiring soon (within a week)
              } else {
                rowClass = ""; // safe
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
                  <td>
                    <strong>{i.status || "AVAILABLE"}</strong>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(i.id)}
                    >
                      Delete
                    </Button>
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
