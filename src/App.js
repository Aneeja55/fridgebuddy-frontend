import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddIngredientForm from "./components/AddIngredientForm";
import ViewIngredients from "./components/ViewIngredients";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ViewIngredients />} />
        <Route path="/add" element={<AddIngredientForm />} />
      </Routes>
    </Router>
  );
}

export default App;
