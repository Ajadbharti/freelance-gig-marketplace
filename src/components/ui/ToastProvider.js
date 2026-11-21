"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { generateId } from "@/lib/utils";

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: CheckCircle2, color: "text-[#047857]" },
  error: { icon: XCircle, color: "text-[#DC2626]" },
  info: { icon: Info, color: "text-[#2563EB]" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = generateId("t");
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
      >
        {toasts.map((t) => {
          const style = STYLES[t.type] ?? STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-none border border-[#0F172A] bg-white p-4 shadow-[3px_3px_0px_#0F172A]"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.color}`} />
              <p className="flex-1 font-mono text-xs text-[#0B1C30]">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-slate-400 transition hover:text-[#0F172A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
