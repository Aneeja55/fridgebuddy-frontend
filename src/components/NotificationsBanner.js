import React, { useEffect, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useToast } from "./ToastContext";

function NotificationsBanner() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const { showToast } = useToast();
  const seenMessages = useRef(new Set()); // Prevent duplicate toasts

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/notifications/${userId}`);
        const now = dayjs();

        // Group by ingredientId to keep only one message per ingredient
        const latestByIngredient = {};
        res.data.forEach((n) => {
          const existing = latestByIngredient[n.ingredientId];
          if (!existing || n.id > existing.id) {
            latestByIngredient[n.ingredientId] = n;
          }
        });

        Object.values(latestByIngredient).forEach((n) => {
          const msg = n.message || "";
          const match = msg.match(/([A-Za-z0-9_ ]+)\s(is|has)/);
          const name = match ? match[1].trim() : "An ingredient";

          const dateMatch = msg.match(/(\d{4}-\d{2}-\d{2})/);
          const expiryDate = dateMatch ? dayjs(dateMatch[1]) : null;

          let message = "";
          let variant = "warning";

          // If it says "has expired"
          if (msg.toLowerCase().includes("has expired")) {
            message = `<strong>Expiry Alert</strong><br /><small>Just now</small><br />❌ ${name} has expired on <strong>${expiryDate?.format("MMMM D, YYYY")}</strong>.`;
            variant = "danger";
          }
          // If it says "is expiring"
          else if (msg.toLowerCase().includes("is expiring")) {
            message = `<strong>Expiry Alert</strong><br /><small>Just now</small><br />⚠️ ${name} is expiring on <strong>${expiryDate?.format("MMMM D, YYYY")}</strong>.`;
            variant = "warning";
          } else {
            return;
          }

          // Avoid duplicate notifications
          if (!seenMessages.current.has(message)) {
            seenMessages.current.add(message);
            showToast(message, variant, true);
          }
        });
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId, showToast]);

  return null;
}

export default NotificationsBanner;
