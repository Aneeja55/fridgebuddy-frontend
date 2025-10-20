import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import IngredientList from "./components/IngredientList";
import AddIngredientForm from "./components/AddIngredientForm";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NotificationsBanner from "./components/NotificationsBanner"; 

// Route guard
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-main">
        <NotificationsBanner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><IngredientList /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><AddIngredientForm /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
