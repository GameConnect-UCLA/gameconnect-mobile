/** Auth state store using Zustand. */
import { create } from 'zustand'

/** Auth state type tracking JWT token and authentication status. */
export type AuthState = {
  isAuthenticated: boolean
  accessToken: string | null
  setAuthenticated: (token: string) => void
  reset: () => void
}

const initialState = {
  isAuthenticated: false,
  accessToken: null,
}

/** Zustand store managing JWT token and isAuthenticated state. */
export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setAuthenticated: (token) =>
    set({ isAuthenticated: true, accessToken: token}),

  reset: () =>
    set(initialState),
}))
