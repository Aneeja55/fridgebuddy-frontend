import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";

function NotificationsBanner() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/notifications/${userId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [userId]);

  return (
    <ToastContainer position="top-end" className="p-3">
      {notifications.map((n, i) => (
        <Toast key={i} bg="warning" delay={6000} autohide>
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
