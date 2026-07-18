/** User state store using Zustand. */
import { create } from 'zustand'
import type { User } from '@/src/core/types/user.types'

/** User state type for caching the current logged-in user. */
type UserState = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

/** Zustand store caching the current logged-in User. */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
