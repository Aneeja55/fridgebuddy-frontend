import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddIngredientForm from "./components/AddIngredientForm";
import ViewIngredients from "./components/ViewIngredients";
import AppNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/ToastContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <ToastProvider>
      <div className="app-layout d-flex flex-column min-vh-100 bg-light">
        <Router>
          <AppNavbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<ViewIngredients />} />
              <Route path="/add" element={<AddIngredientForm />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
