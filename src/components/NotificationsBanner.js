import React, { useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useToast } from "./ToastContext";

function NotificationsBanner() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const { showToast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = () => {
      axios
        .get(`http://localhost:8080/notifications/${userId}`)
        .then((res) => {
          const seen = new Set();
          res.data.forEach((n) => {
            if (
              n.message?.toLowerCase().includes("expir") &&
              !seen.has(n.message)
            ) {
              seen.add(n.message);
              const expDate = n.ingredient?.expiryDate
                ? dayjs(n.ingredient.expiryDate).format("MMM D, YYYY")
                : "soon";
              showToast(`⚠️ ${n.message} (Exp: ${expDate})`, "warning");
            }
          });
        })
        .catch((err) => console.error("Error fetching notifications:", err));
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 360000); // refresh every minute
    return () => clearInterval(interval);
  }, [userId, showToast]);

  return null; // No JSX needed — handled via ToastContext
}

export default NotificationsBanner;
