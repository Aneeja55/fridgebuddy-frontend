import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

function NotificationsBanner() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 6; // static for now

  // ✅ Fetch unseen notifications
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

  // ✅ Dismiss / mark as seen
  const dismissNotification = (id) => {
    axios
      .put(`http://localhost:8080/notifications/${id}/seen`)
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch((err) => {
        console.error("Error marking notification as seen:", err);
        // still hide locally
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      });
  };

  // ✅ Load + auto-refresh every 10s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" size="sm" /> Checking expiry alerts...
      </div>
    );
  }

  // ✅ Render Toasts
  return (
    <ToastContainer position="top-end" className="p-3">
      {notifications.map((n) => (
        <Toast
          key={n.id}
          bg="warning"
          onClose={() => dismissNotification(n.id)} // ✅ working dismiss
          show={true}
          autohide={false} // disable autohide for manual dismissal
          className="mb-3 shadow-sm"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">⚠️ Expiry Alert</strong>
            <small className="text-muted">Just now</small>
          </Toast.Header>
          <Toast.Body>{n.message}</Toast.Body>
        </Toast>
      ))}

      {notifications.length === 0 && (
        <Toast bg="success" className="shadow-sm">
          <Toast.Header>
            <strong className="me-auto">✅ All Good</strong>
          </Toast.Header>
          <Toast.Body>All ingredients are fresh and up to date!</Toast.Body>
        </Toast>
      )}
    </ToastContainer>
  );
}

export default NotificationsBanner;
