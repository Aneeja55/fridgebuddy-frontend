import React, { useEffect, useState } from "react";
import axios from "axios";

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const userId = 1; // Replace with actual logged-in user ID if applicable

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/ingredients/${userId}`);
      setIngredients(res.data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const deleteIngredient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      await axios.delete(`http://localhost:8080/ingredients/${id}`);
      alert("Ingredient deleted successfully!");
      // Refresh the list after deletion
      setIngredients(ingredients.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      alert("Failed to delete ingredient.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ingredient List</h2>
      {ingredients.length === 0 ? (
        <p>No ingredients found.</p>
      ) : (
        <table className="table table-bordered">
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
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.category}</td>
                <td>{ingredient.purchaseDate}</td>
                <td>{ingredient.expiryDate}</td>
                <td>{ingredient.status}</td>
                <td>
                  <button
                    onClick={() => deleteIngredient(ingredient.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IngredientList;
