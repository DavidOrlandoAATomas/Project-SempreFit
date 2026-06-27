"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "@/components/ui/Toast";

interface ToastContextData {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}