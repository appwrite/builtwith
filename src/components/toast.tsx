"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "info" | "success" | "error";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
  durationMs: number;
};

type ToastApi = {
  show: (message: string, opts?: { kind?: ToastKind; durationMs?: number }) => void;
  info: (message: string, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  dismiss: (id: number) => void;
};

const Ctx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast outside ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timersRef.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timersRef.current[id];
    }
  }, []);

  const show = useCallback(
    (
      message: string,
      opts?: { kind?: ToastKind; durationMs?: number }
    ) => {
      idRef.current += 1;
      const id = idRef.current;
      const kind: ToastKind = opts?.kind ?? "info";
      const durationMs = opts?.durationMs ?? (kind === "error" ? 6000 : 4000);
      setToasts((list) => [...list, { id, kind, message, durationMs }]);
      timersRef.current[id] = setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== id));
        delete timersRef.current[id];
      }, durationMs);
    },
    []
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      info: (m, d) => show(m, { kind: "info", durationMs: d }),
      success: (m, d) => show(m, { kind: "success", durationMs: d }),
      error: (m, d) => show(m, { kind: "error", durationMs: d }),
      dismiss,
    }),
    [show, dismiss]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of Object.values(timers)) clearTimeout(t);
    };
  }, []);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div
        className="toast-stack"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <output
            key={t.id}
            className={`toast toast-${t.kind}`}
            role={t.kind === "error" ? "alert" : "status"}
          >
            <span
              className={`toast-icon icon-${
                t.kind === "error"
                  ? "exclamation"
                  : t.kind === "success"
                    ? "check"
                    : "info"
              }`}
              aria-hidden="true"
            />
            <span className="toast-message">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="toast-close"
              aria-label="Dismiss"
            >
              <span className="icon-x" aria-hidden="true" />
            </button>
          </output>
        ))}
      </div>
    </Ctx.Provider>
  );
}
