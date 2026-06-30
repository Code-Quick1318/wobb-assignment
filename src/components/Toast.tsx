import { X, CheckCircle, Info } from "lucide-react";
import { useToastStore } from "@/store";

// ─── Icon & color map keyed by variant ────────────────────────────────────────

const variantStyles = {
  success: {
    container: "bg-gray-900 text-white",
    icon: <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />,
  },
  info: {
    container: "bg-gray-900 text-white",
    icon: <Info size={15} className="text-indigo-400 flex-shrink-0" />,
  },
  warning: {
    container: "bg-gray-900 text-white",
    icon: <Info size={15} className="text-amber-400 flex-shrink-0" />,
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    // Fixed bottom-right, stacked, above everything including the header (z-60)
    <div
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const { container, icon } = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
                        min-w-[220px] max-w-xs
                        ${container}`}
          >
            {icon}
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="ml-1 text-white/50 hover:text-white transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
