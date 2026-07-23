"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "heart";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "info" | "heart") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "info" | "heart" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-in transition-all duration-300 ${
              toast.type === "heart"
                ? "bg-saffron-light border-saffron/30 text-saffron-deep"
                : toast.type === "success"
                ? "bg-teal-light border-teal/30 text-teal-dark"
                : "bg-white border-charcoal/10 text-charcoal"
            }`}
          >
            <span className="text-base">
              {toast.type === "heart" ? "❤️" : toast.type === "success" ? "✨" : "ℹ️"}
            </span>
            <p className="flex-1">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
