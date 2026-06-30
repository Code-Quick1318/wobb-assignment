import { create } from "zustand";

export type ToastVariant = "success" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState & ToastActions>((set) => ({
  toasts: [],

  showToast: (message, variant = "success") => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));

    // Auto-dismiss after 3 s — fire-and-forget, no cleanup needed
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
