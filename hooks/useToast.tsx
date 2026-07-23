"use client";

import { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

// ─────────────────────────────────────────────────────────────────────────────
// useToast — bottom-center toast notification, auto-dismisses in 2s
// ─────────────────────────────────────────────────────────────────────────────

interface ToastState {
  message: string;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, duration = 2000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, duration);
  }, []);

  function ToastPortal() {
    if (typeof document === "undefined" || !toast.visible) return null;
    return createPortal(
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#31A062",
          color: "#fff",
          fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          padding: "10px 24px",
          borderRadius: "24px",
          zIndex: 9999,
          pointerEvents: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          whiteSpace: "nowrap",
          animation: "toast-slide-up 0.25s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {toast.message}
      </div>,
      document.body
    );
  }

  return { showToast, ToastPortal };
}
