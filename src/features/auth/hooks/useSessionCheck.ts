/** Checks if a stored session token exists on app launch. Runs once (staleTime: Infinity). */
import { secureStore } from '@/src/core/lib/secure-store'
import { useAuthStore } from '@/src/core/store/auth.store'
import { useUserStore } from '@/src/core/store/user.store'
import { getMe } from '@/src/features/profile/api/profile.api'
import { useQuery } from '@tanstack/react-query'
import { handleLogout } from '@/src/core/api/client'

/** Reads stored access token on mount. If found, sets the auth store as authenticated.
 * @returns `UseQueryResult<boolean>` — `true` if a valid session exists, `false` otherwise.
 */
export const useSessionCheck = () => {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

  const setUser = useUserStore((s) => s.setUser)

  return useQuery({
    queryKey: ['sessionCheck'],
    queryFn: async () => {
      const token = await secureStore.get(secureStore.KEYS.ACCESS_TOKEN)
      if (!token) return false

      try {
        const user = await getMe()
        const latestToken = await secureStore.get(secureStore.KEYS.ACCESS_TOKEN)
        if (latestToken) setAuthenticated(latestToken)
        setUser(user)
        return true
      } catch (error) {
        console.error('Session check failed:', error)
        handleLogout()
        return false
      }
    },
    staleTime: Infinity,
    retry: false,
  })
}
