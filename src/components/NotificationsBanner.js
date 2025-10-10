import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

function NotificationsBanner() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 6;

  const fetchNotifications = () => {
    axios
      .get(`http://localhost:8080/notifications/${userId}`)
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      });
  };

const dismissNotification = (id) => {
    // Optional backend sync
    axios
      .put(`http://localhost:8080/notifications/${id}/seen`)
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch((err) => {
        console.error("Error marking notification as seen:", err);
        // Still hide locally even if backend fails
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      });
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2340000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" size="sm" /> Checking expiry alerts...
      </div>
    );
  }


return (
  <ToastContainer position="top-end" className="p-3">
    {notifications.map((n, i) => (
      <Toast
        key={n.id}
        bg="warning"
        onClose={() => dismissNotification(n.id)} 
        show={true}
        delay={5000}
        autohide
        className="mb-3 shadow-sm"
      >
        <Toast.Header closeButton>
          <strong className="me-auto">⚠️ Expiry Alert</strong>
          <small className="text-muted">Just now</small>
        </Toast.Header>
        <Toast.Body>{n.message}</Toast.Body>
      </Toast>
    ))}
  </ToastContainer>
);

}

export default NotificationsBanner;
