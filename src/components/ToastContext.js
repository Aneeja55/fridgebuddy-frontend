import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Toast, ToastContainer, Button } from "react-bootstrap";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

/**
 * ToastProvider
 * - Prevents duplicate messages.
 * - Makes 'warning' toasts persistent (user must close manually).
 * - Adds visible close (×) button for every toast.
 */

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const messagesRef = useRef(new Set());

  const removeToast = useCallback((id, message) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (message) messagesRef.current.delete(message);
  }, []);

  const showToast = useCallback((message, variant = "success") => {
    if (!message) return;
    const key = message.trim();
    if (messagesRef.current.has(key)) return; // avoid duplicate messages
    messagesRef.current.add(key);

    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message: key, variant }]);

    // only auto-hide non-warning toasts
    if (variant !== "warning") {
      setTimeout(() => removeToast(id, key), 4000);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer className="custom-toast-container" position="top-end">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            show
            onClose={() => removeToast(t.id, t.message)}
            autohide={t.variant !== "warning"}
            delay={4000}
            bg={
              t.variant === "danger"
                ? "danger"
                : t.variant === "warning"
                ? "warning"
                : t.variant === "info"
                ? "info"
                : "success"
            }
            className="mb-2 shadow-sm toast-animated"
          >
            <div
              className="d-flex justify-content-between align-items-start p-2"
              style={{ minWidth: "280px", maxWidth: "350px" }}
            >
              <div
                className={
                  t.variant === "warning"
                    ? "text-dark fw-semibold me-2"
                    : "text-white fw-semibold me-2"
                }
                style={{ wordBreak: "break-word" }}
              >
                {t.message}
              </div>

              {/* Manual Close Button */}
              <Button
                size="sm"
                variant={t.variant === "warning" ? "outline-dark" : "outline-light"}
                onClick={() => removeToast(t.id, t.message)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: t.variant === "warning" ? "#000" : "#fff",
                  fontWeight: "bold",
                  lineHeight: "1",
                  padding: "0 6px",
                  cursor: "pointer",
                }}
              >
                ×
              </Button>
            </div>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
