import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Dropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BellFill } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { useToast } from "./ToastContext";

function AppNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);
  const { showToast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("user");
    showToast("👋 Logged out successfully", "info");
    navigate("/login");
  };

  const fetchNotifications = () => {
    if (!user?.id) return;
    axios
      .get(`http://localhost:8080/notifications/${user.id}`)
      .then((res) => {
        const unique = [];
        const seen = new Set();
        for (const n of res.data) {
          if (!seen.has(n.message)) {
            unique.push(n);
            seen.add(n.message);
          }
        }
        setNotifications(unique);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleDismiss = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm sticky-top"
      style={{
        background: "rgba(25, 25, 25, 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-light"
          style={{ fontSize: "1.4rem", letterSpacing: "0.5px" }}
        >
          EAT-ME-FIRST
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/" className="nav-link-custom">
                  Ingredients
                </Nav.Link>
                <Nav.Link as={Link} to="/add" className="nav-link-custom">
                  + Add Ingredient
                </Nav.Link>
              </Nav>

              <div className="d-flex align-items-center gap-3">
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="position-relative text-light"
                    style={{ cursor: "pointer" }}
                  >
                    <BellFill size={22} />
                    {notifications.length > 0 && (
                      <Badge
                        bg="danger"
                        pill
                        className="position-absolute top-0 start-100 translate-middle"
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      minWidth: "320px",
                      borderRadius: "10px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                    }}
                  >
                    <Dropdown.Header className="fw-bold text-dark">
                      ⚠️ Expiry Alerts
                    </Dropdown.Header>
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <Dropdown.Item
                          key={i}
                          className="text-wrap d-flex justify-content-between align-items-start"
                        >
                          <div>
                            <strong>{n.message}</strong>
                            {n.ingredient?.expiryDate && (
                              <div className="text-muted small">
                                Exp:{" "}
                                {dayjs(n.ingredient.expiryDate).format(
                                  "MMM D, YYYY"
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // 🧩 prevents dropdown from closing
                              handleDismiss(i);
                            }}
                          >
                            ×
                          </Button>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled>
                        No active alerts 🎉
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <span className="text-light me-2">
                  Hi, <strong>{user.username}</strong>
                </span>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className="nav-link-custom">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="nav-link-custom">
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
