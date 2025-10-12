import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto shadow-sm">
      <Container className="text-center">
        <small>
          🧊 <strong>Fridge Buddy</strong> — keeping your fridge fresh since 2025 <br />
          <span className="text-secondary">
            Built with ❤️ using React + Spring Boot
          </span>
        </small>
      </Container>
    </footer>
  );
}

export default Footer;
