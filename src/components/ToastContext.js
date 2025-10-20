import React, { createContext, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant = "success", allowHtml = false) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant, allowHtml }]);

    // Auto remove after 10 seconds
    setTimeout(() => removeToast(id), 10000);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            onClose={() => removeToast(t.id)}
            bg={t.variant}
            show
            className="mb-2 shadow-sm"
          >
            <Toast.Body className="text-white fw-semibold">
              {t.allowHtml ? (
                <span dangerouslySetInnerHTML={{ __html: t.message }} />
              ) : (
                t.message
              )}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
