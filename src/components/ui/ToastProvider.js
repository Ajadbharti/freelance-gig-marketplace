"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { generateId } from "@/lib/utils";

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  error: { icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-100" },
  info: { icon: Info, color: "text-violet-600 bg-violet-50 border-violet-100" },
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
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5"
      >
        {toasts.map((t) => {
          const style = STYLES[t.type] ?? STYLES.info;
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur-md animate-fade-in"
            >
              <div className={`p-1 rounded-xl border shrink-0 ${style.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="flex-1 font-sans text-xs font-semibold text-slate-800 leading-relaxed pt-0.5">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-slate-700 transition p-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
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
