import { create } from 'zustand';

export type ToastVariant = 'success' | 'error';

type ToastState = {
  message: string;
  variant: ToastVariant;
  visible: boolean;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

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