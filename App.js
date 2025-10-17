import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ViewIngredients from "./components/ViewIngredients";
import AddIngredientForm from "./components/AddIngredientForm";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ViewIngredients />} />
            <Route path="/add" element={<AddIngredientForm />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
