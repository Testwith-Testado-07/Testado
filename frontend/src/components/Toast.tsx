"use client";

import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const COLORS: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46", icon: "#059669" },
  error:   { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", icon: "#DC2626" },
  info:    { bg: "#EFF6FF", border: "#93C5FD", text: "#1E40AF", icon: "#2563EB" },
  warning: { bg: "#FFFBEB", border: "#FCD34D", text: "#92400E", icon: "#D97706" },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[toast.type];

  useEffect(() => {
    // Animate in
    const tIn = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 4s
    const tOut = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 350);
    }, 4000);
    return () => { clearTimeout(tIn); clearTimeout(tOut); };
  }, [toast.id, onRemove]);

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 18px",
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        minWidth: 280,
        maxWidth: 380,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(40px)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
      }}
      onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 350); }}
    >
      {/* Icon circle */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: c.icon,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0,
      }}>
        {ICONS[toast.type]}
      </div>

      {/* Message */}
      <p style={{ margin: 0, fontSize: 14, color: c.text, fontWeight: 500, lineHeight: 1.5, flex: 1 }}>
        {toast.message}
      </p>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

/** Hook to manage toasts */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast(msg, "success"),
    error:   (msg: string) => addToast(msg, "error"),
    info:    (msg: string) => addToast(msg, "info"),
    warning: (msg: string) => addToast(msg, "warning"),
  };

  return { toasts, toast, removeToast };
}
