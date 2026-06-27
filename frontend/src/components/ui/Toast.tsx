"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 min-w-[300px] animate-slideIn`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto hover:opacity-80">
        <X size={18} />
      </button>
    </div>
  );
}