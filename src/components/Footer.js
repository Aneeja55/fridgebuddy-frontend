import React from "react";
import { Container } from "react-bootstrap";// optional for extra styles

function Footer() {
  return (
    <footer className="app-footer bg-dark text-light py-3 mt-auto">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <small><strong>EAT-ME-FIRST</strong> — keeping your fridge fresh since 2025</small>
        </div>
        <div className="mt-2 mt-md-0">
          <small className="text-secondary">Built with ❤️ using React + Spring Boot</small>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
