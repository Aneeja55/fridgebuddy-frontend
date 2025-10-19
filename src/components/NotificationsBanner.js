import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";
import dayjs from "dayjs";
import "./NotificationsBanner.css";

function NotificationsBanner() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch notifications (expiry alerts)
  const fetchNotifications = () => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/notifications/${userId}`)
      .then((res) => {
        // Avoid duplicates by unique message filtering
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
      .catch((err) =>
        console.error("Error fetching notifications:", err)
      );
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 360000); // every 60s
    return () => clearInterval(interval);
  }, [userId]);

  // ✅ Manual dismiss
  const dismiss = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  if (!notifications.length) return null;

  return (
    <ToastContainer
      position="top-end"
      className="p-3 custom-toast-container"
      style={{ zIndex: 1050 }}
    >
      {notifications.map((n, i) => {
        const expiryDate = n.ingredient?.expiryDate
          ? dayjs(n.ingredient.expiryDate).format("MMM D, YYYY")
          : "Soon";

        return (
          <Toast
            key={i}
            onClose={() => dismiss(i)}
            bg="warning"
            show={true}
            className="shadow-sm toast-animated mb-2"
          >
            <Toast.Header closeButton={true}>
              <strong className="me-auto">⚠️ Expiry Alert</strong>
              <small>{expiryDate}</small>
            </Toast.Header>
            <Toast.Body className="text-dark fw-semibold">
              {n.message}
            </Toast.Body>
          </Toast>
        );
      })}
    </ToastContainer>
  );
}

export default NotificationsBanner;
