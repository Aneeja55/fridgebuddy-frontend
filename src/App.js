import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./auth/Login";
import Register from "./auth/Register";
import IngredientList from "./components/IngredientList";
import AddIngredientForm from "./components/AddIngredientForm";
import Navbar from "./components/Navbar";
import NotificationsBanner from "./components/NotificationsBanner";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage (persistent login)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      {/* Navbar visible only for logged-in users */}
      {user && <Navbar onLogout={handleLogout} />}

      <div className="container mt-4">
        {/* Notifications visible only for logged-in users */}
        {user && <NotificationsBanner />}

        <Routes>
          {/* Public Routes */}
          {!user && <Route path="/login" element={<Login />} />}
          {!user && <Route path="/register" element={<Register />} />}

          {/* Protected Routes */}
          {user && (
            <>
              <Route path="/" element={<IngredientList user={user} />} />
              <Route path="/add" element={<AddIngredientForm user={user} />} />
            </>
          )}

          {/* Default Redirect */}
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
