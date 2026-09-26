'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
const ToastContext = createContext(null);

// Wrap your app (or dashboard layout) once: <ToastProvider><App /></ToastProvider>
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, { type = 'success', duration = 3200 } = {}) => {
    const id = idRef.current++;
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="tm-toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`tm-toast tm-toast--${t.type}`} onClick={() => dismiss(t.id)}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Usage inside any component: const { showToast } = useToast();
// showToast('Task updated', { type: 'success' })
// showToast('Could not save changes', { type: 'error' })
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
