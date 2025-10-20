import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Toast, ToastContainer, Button } from "react-bootstrap";
import dayjs from "dayjs";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const messagesRef = useRef(new Set());

  const removeToast = useCallback((id, message) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (message) messagesRef.current.delete(message);
  }, []);

  const showToast = useCallback(
    (message, variant = "success") => {
      if (!message) return;
      const key = message.trim();
      if (messagesRef.current.has(key)) return; // avoid duplicates
      messagesRef.current.add(key);

      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message: key, variant }]);

      // only auto-hide non-warning toasts
      if (variant !== "warning") {
        setTimeout(() => removeToast(id, key), 4000);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3 custom-toast-container">
        {toasts.map((t) => {
          const isWarning = t.variant === "warning";

          // Custom style for warning / expiry alerts
          const formattedMessage = (() => {
            if (isWarning) {
              // Extract the ingredient name and expiry date (if present)
              const match = t.message.match(/'(.+?)'/);
              const name = match ? match[1] : "An ingredient";
              const dateMatch = t.message.match(/(\d{4}-\d{2}-\d{2})/);
              const formattedDate = dateMatch
                ? dayjs(dateMatch[1]).format("MMMM DD, YYYY")
                : "soon";
              return `${name} is expiring on ${formattedDate}.`;
            }
            return t.message;
          })();

          return (
            <Toast
              key={t.id}
              show
              onClose={() => removeToast(t.id, t.message)}
              autohide={!isWarning}
              delay={4000}
              bg={isWarning ? "light" : t.variant}
              className={`mb-3 shadow-sm border-0 ${isWarning ? "toast-expiry" : ""}`}
              style={{
                minWidth: "320px",
                maxWidth: "360px",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {isWarning ? (
                <>
                  <div
                    className="d-flex justify-content-between align-items-center px-3 py-2"
                    style={{ backgroundColor: "#fff3cd", borderBottom: "1px solid #ffeeba" }}
                  >
                    <strong className="text-dark">⚠️ Expiry Alert</strong>
                    <small className="text-muted">Just now</small>
                  </div>
                  <div className="px-3 py-2 text-dark">
                    {formattedMessage}
                    <div className="d-flex justify-content-end">
                      <Button
                        size="sm"
                        variant="outline-dark"
                        onClick={() => removeToast(t.id, t.message)}
                        style={{
                          border: "none",
                          background: "transparent",
                          fontWeight: "bold",
                          color: "#333",
                          padding: "0 4px",
                          marginTop: "4px",
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Toast.Body
                  className={`fw-semibold text-white d-flex justify-content-between align-items-center`}
                >
                  <span>{t.message}</span>
                  <Button
                    size="sm"
                    variant="outline-light"
                    onClick={() => removeToast(t.id, t.message)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontWeight: "bold",
                      color: "#fff",
                      lineHeight: "1",
                      padding: "0 6px",
                    }}
                  >
                    ×
                  </Button>
                </Toast.Body>
              )}
            </Toast>
          );
        })}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
