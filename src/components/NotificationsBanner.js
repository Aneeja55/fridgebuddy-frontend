import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";
import "./NotificationsBanner.css"; // custom animation + style

function NotificationsBanner() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllGood, setShowAllGood] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
const userId = storedUser?.id;

  // ✅ Fetch notifications from backend
  const fetchNotifications = () => {
    axios
      .get(`http://localhost:8080/notifications/${userId}`)
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
        setShowAllGood(true);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      });
  };

  // ✅ Dismiss a specific notification (local + backend)
  const dismissNotification = (id) => {
    axios
      .put(`http://localhost:8080/notifications/${id}/seen`)
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      });
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center my-3 fade-in">
        <Spinner animation="border" size="sm" /> Checking expiry alerts...
      </div>
    );
  }

  return (
    <ToastContainer
      position="top-end"
      className="p-3 custom-toast-container"
      style={{ zIndex: 1060 }}
    >
      {/* ⚠️ Expiry Notifications */}
      {notifications.map((n) => (
        <Toast
          key={n.id}
          bg="warning"
          show={true}
          onClose={() => dismissNotification(n.id)}
          autohide={false}
          className="shadow-lg rounded-4 mb-3 toast-animated"
        >
          <Toast.Header closeButton className="bg-warning-subtle rounded-top-4">
            <strong className="me-auto">⚠️ Expiry Alert</strong>
            <small className="text-muted">Just now</small>
          </Toast.Header>
          <Toast.Body className="fw-semibold text-dark">
            {n.message}
          </Toast.Body>
        </Toast>
      ))}

      {/* ✅ All Good Notification */}
      {notifications.length === 0 && showAllGood && (
        <Toast
          bg="success"
          show={true}
          onClose={() => setShowAllGood(false)}
          delay={6000}
          autohide
          className="shadow-lg rounded-4 mb-3 toast-animated"
        >
          <Toast.Header
            closeButton
            className="bg-success-subtle rounded-top-4 text-dark"
          >
            <strong className="me-auto">✅ All Good</strong>
          </Toast.Header>
          <Toast.Body className="text-white fw-semibold">
            All ingredients are fresh and up to date!
          </Toast.Body>
        </Toast>
      )}
    </ToastContainer>
  );
}

export default NotificationsBanner;
