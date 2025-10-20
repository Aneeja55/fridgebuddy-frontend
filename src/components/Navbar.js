import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Dropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BellFill } from "react-bootstrap-icons";
import dayjs from "dayjs";

function AppNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.info("👋 Logged out successfully");
    navigate("/login");
  };

  // ✅ Fetch notifications
  const fetchNotifications = () => {
    if (!user?.id) return;
    axios
      .get(`http://localhost:8080/notifications/${user.id}`)
      .then((res) => {
        // Filter duplicates by unique message
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
    const interval = setInterval(fetchNotifications, 60000); // refresh every 60 sec
    return () => clearInterval(interval);
  }, [user]);

  const handleDismiss = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🧊 Fridge Buddy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Ingredients
                </Nav.Link>
                <Nav.Link as={Link} to="/add">
                  + Add Ingredient
                </Nav.Link>
              </Nav>

              <div className="d-flex align-items-center gap-3">
                {/* ✅ Notification Bell */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="position-relative cursor-pointer text-light"
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

                  <Dropdown.Menu style={{ minWidth: "300px" }}>
                    <Dropdown.Header>⚠️ Expiry Alerts</Dropdown.Header>
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
                                Exp: {dayjs(n.ingredient.expiryDate).format("MMM D, YYYY")}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDismiss(i)}
                          >
                            ×
                          </Button>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled>No active alerts 🎉</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <span className="text-light me-2">
                  Hi, <strong>{user.username}</strong>
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
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
