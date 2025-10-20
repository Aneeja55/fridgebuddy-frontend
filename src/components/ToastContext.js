import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

/**
 * ToastProvider:
 * - Avoids duplicate toasts with same message.
 * - Keeps "warning" variant persistent (autohide=false) until manual close.
 * - Other variants autohide after 4000ms.
 */

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const messagesRef = useRef(new Set()); // track messages currently shown

  const removeToast = useCallback((id, message) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (message) messagesRef.current.delete(message);
  }, []);

  const showToast = useCallback((message, variant = "success") => {
    if (!message) return;
    const key = message.trim();
    if (messagesRef.current.has(key)) return; // avoid duplicates
    messagesRef.current.add(key);

    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message: key, variant }]);
    // if variant is not 'warning' we can auto remove after 4s.
    if (variant !== "warning") {
      setTimeout(() => removeToast(id, key), 4000);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Custom positioned container */}
      <ToastContainer className="custom-toast-container" position="top-end">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            onClose={() => removeToast(t.id, t.message)}
            show
            autohide={t.variant !== "warning"}
            delay={4000}
            bg={t.variant === "danger" ? "danger" : t.variant === "warning" ? "warning" : t.variant === "info" ? "info" : "success"}
            className="mb-2 shadow-sm toast-animated"
          >
            <Toast.Body className={t.variant === "warning" ? "text-dark fw-semibold" : "text-white fw-semibold"}>
              {t.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
