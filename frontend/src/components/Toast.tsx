"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const STYLES: Record<ToastType, { icon: LucideIcon; accent: string }> = {
  success: { icon: CircleCheck, accent: "text-emerald-600" },
  error: { icon: CircleAlert, accent: "text-red-600" },
  info: { icon: Info, accent: "text-blue-600" },
  warning: { icon: TriangleAlert, accent: "text-amber-600" },
};

const EXIT_MS = 250;

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [leaving, setLeaving] = useState(false);
  const { icon: Icon, accent } = STYLES[toast.type];

  useEffect(() => {
    if (leaving) {
      const t = setTimeout(() => onRemove(toast.id), EXIT_MS);
      return () => clearTimeout(t);
    }
    // Errors stay up a little longer so they can be read
    const t = setTimeout(() => setLeaving(true), toast.type === "error" ? 6000 : 4000);
    return () => clearTimeout(t);
  }, [leaving, toast.id, toast.type, onRemove]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-border bg-white/95 py-3.5 pr-3 pl-4 shadow-lift backdrop-blur-md sm:w-[380px]",
        leaving
          ? "animate-out fade-out-0 slide-out-to-right-4 fill-mode-forwards"
          : "animate-in fade-in-0 slide-in-from-bottom-3 duration-300"
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", accent)} aria-hidden="true" />
      <p className="flex-1 text-sm font-medium leading-relaxed text-foreground">{toast.message}</p>
      <button
        type="button"
        onClick={() => setLeaving(true)}
        aria-label="Dismiss notification"
        className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

type ToastApi = Record<ToastType, (message: string) => void>;

const ToastContext = createContext<ToastApi | null>(null);

/** Mounted once in the root layout so any page can raise toasts and they survive navigation. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo<ToastApi>(() => {
    const add = (type: ToastType) => (message: string) =>
      setToasts((prev) => [...prev.slice(-3), { id: crypto.randomUUID(), message, type }]);
    return { success: add("success"), error: add("error"), info: add("info"), warning: add("warning") };
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[9999] flex flex-col items-end gap-2.5 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Returns a stable `toast` object, so it is safe in effect dependency arrays. */
export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside <ToastProvider>");
  return { toast };
}
