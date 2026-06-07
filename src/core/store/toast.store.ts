/** Toast notification store using Zustand. */
import { create } from 'zustand';

/** Toast variant type: success, error, warning, or info. */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

type ToastState = {
  message: string;
  variant: ToastVariant;
  visible: boolean;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

/** Zustand store managing app-wide toast notifications with auto-dismiss. */
export const useToastStore = create<ToastState>((set) => ({
  message: '',
  variant: 'success',
  visible: false,
  showToast: (message, variant = 'success') => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    set({ message, variant, visible: true });

    toastTimer = setTimeout(() => {
      set({ visible: false });
      toastTimer = null;
    }, 2600);
  },
  hideToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }

    set({ visible: false });
  },
}));
