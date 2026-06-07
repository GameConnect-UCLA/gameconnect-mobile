/** Confirm dialog state and hook using Zustand. */
import { create } from 'zustand'

type ConfirmOptions = {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

type ConfirmState = {
  isOpen: boolean
  options: ConfirmOptions | null
  resolve: ((value: boolean) => void) | null
  open: (options: ConfirmOptions) => Promise<boolean>
  confirm: () => void
  cancel: () => void
}

/** Zustand store backing the confirm dialog state. */
export const useConfirmDialogStore = create<ConfirmState>((set) => ({
  isOpen: false,
  options: null,
  resolve: null,
  open: (options) =>
    new Promise((resolve) => {
      set({ isOpen: true, options, resolve })
    }),
  confirm: () =>
    set((state) => {
      state.resolve?.(true)
      return { isOpen: false, options: null, resolve: null }
    }),
  cancel: () =>
    set((state) => {
      state.resolve?.(false)
      return { isOpen: false, options: null, resolve: null }
    }),
}))

/** Hook that returns a confirm function returning Promise<boolean>. @returns { confirm: (options: ConfirmOptions) => Promise<boolean> }. */
export function useConfirmDialog() {
  const open = useConfirmDialogStore((s) => s.open)
  return { confirm: open }
}
