import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Spinner } from "react-bootstrap";

function NotificationsBanner() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = () => {
    axios
      .get("http://localhost:8080/notifications/6") // userId = 1
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      });
    };
    fetchNotifications();
  const interval = setInterval(fetchNotifications, 10000); // refresh every 10s
  return () => clearInterval(interval);

  }, []);

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" size="sm" /> Checking expiry alerts...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Alert variant="success" className="text-center my-3">
        🎉 All ingredients are fresh!
      </Alert>
    );
  }

  return (
    <div className="my-3">
      {notifications.map((n) => (
        <Alert
          key={n.id}
          variant="warning"
          className="d-flex justify-content-between align-items-center"
        >
          <span>⚠️ {n.message}</span>
        </Alert>
      ))}
    </div>
  );
}

export default NotificationsBanner;
