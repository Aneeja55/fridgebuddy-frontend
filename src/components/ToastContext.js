import React, { createContext, useContext, useState } from "react";
import { Toast, ToastContainer, Button } from "react-bootstrap";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // generate a robust unique id
  const genId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  /**
   * showToast(message, variant, allowHtml=false, manualClose=false)
   * - allowHtml: whether `message` contains HTML (we use dangerouslySetInnerHTML)
   * - manualClose: if true, toast will NOT auto-dismiss; user must click ×
   */
  const showToast = (message, variant = "success", allowHtml = false, manualClose = false) => {
    const id = genId();
    setToasts((prev) => [...prev, { id, message, variant, allowHtml, manualClose }]);

    if (!manualClose) {
      // auto remove after 10s
      setTimeout(() => removeToast(id), 10000);
    }
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

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
      autohide={false} // 👈 disables auto close
    >
      <Toast.Header closeButton>
        <strong className="me-auto text-dark">🧊 Fridge Buddy</strong>
      </Toast.Header>
      <Toast.Body className="text-dark fw-semibold">
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
