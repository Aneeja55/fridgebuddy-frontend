import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import IngredientList from "./components/IngredientList";
import AddIngredientForm from "./components/AddIngredientForm";
import Login from "./auth/Login";
import Register from "./auth/Register";

// ✅ Route Guard to protect user pages
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <IngredientList />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddIngredientForm />
            </PrivateRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
