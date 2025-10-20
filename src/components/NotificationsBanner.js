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

        res.data.forEach((n) => {
          // ✅ Handle both backend formats
          const ingredient = n.ingredient || {};
          const name = ingredient.name || n.message?.match(/(\b[A-Z][a-zA-Z0-9_ ]+)/)?.[0] || "An ingredient";
          const expiryDate = ingredient.expiryDate
            ? dayjs(ingredient.expiryDate)
            : dayjs(n.expiryDate || now.add(2, "day")); // fallback

          const daysLeft = expiryDate.diff(now, "day");

          let message = "";
          let variant = "warning";

          // 🧊 Determine notification message
          if (expiryDate.isBefore(now, "day")) {
            message = `<strong>Expiry Alert</strong><br /><small>Just now</small><br />❌ ${name} has expired on <strong>${expiryDate.format(
              "MMMM D, YYYY"
            )}</strong>.`;
            variant = "danger";
          } else if (daysLeft <= 3) {
            message = `<strong>Expiry Alert</strong><br /><small>Just now</small><br />⚠️ ${name} is expiring on <strong>${expiryDate.format(
              "MMMM D, YYYY"
            )}</strong>.`;
          } else {
            return; // Skip items that are not urgent
          }

          // ✅ Avoid repeating the same message
          if (!seenMessages.current.has(message)) {
            seenMessages.current.add(message);
            showToast(message, variant,true);
          }
        });
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // every minute
    return () => clearInterval(interval);
  }, [userId, showToast]);

  return null;
}

export default NotificationsBanner;
