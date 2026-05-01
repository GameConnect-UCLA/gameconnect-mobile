import { create } from 'zustand'
import type { AuthError } from '@/src/types/auth.types'

type AuthState = {
  isAuthenticated: boolean
  accessToken: string | null
  isLoading: boolean
  error: AuthError | null
  setAuthenticated: (token: string) => void
  setError: (error: AuthError) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setAuthenticated: (token) =>
    set({ isAuthenticated: true, accessToken: token, error: null, isLoading: false }),

  setError: (error) =>
    set({ error, isLoading: false, isAuthenticated: false, accessToken: null }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  reset: () =>
    set(initialState),
}))