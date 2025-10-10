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

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
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
        <Toast key={i} bg="warning" delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">⚠️ Expiry Alert</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>{n.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default NotificationsBanner;
