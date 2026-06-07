/** Clears all stored auth tokens, resets Zustand stores, and clears TanStack Query cache. */
import { secureStore } from '@/src/core/lib/secure-store'
import { useAuthStore } from '@/src/core/store/auth.store'
import { useUserStore } from '@/src/core/store/user.store'
import { useQueryClient } from '@tanstack/react-query'

/** Returns a `logout` function that clears tokens, resets stores, and flushes React Query cache. */
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { reset } = useAuthStore()
  const { clearUser } = useUserStore()
  const logout = async () => {
    await secureStore.clearAll()
    reset()
    clearUser()
    queryClient.clear()
  }

  return { logout }
}
