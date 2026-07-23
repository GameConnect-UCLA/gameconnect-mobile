/** Checks if a stored session token exists on app launch. Runs once (staleTime: Infinity). */
import { secureStore } from '@/src/core/lib/secure-store'
import { useAuthStore } from '@/src/core/store/auth.store'
import { useUserStore } from '@/src/core/store/user.store'
import { getMe } from '@/src/features/profile/api/profile.api'
import { useQuery } from '@tanstack/react-query'

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
      if (token) {
        setAuthenticated(token)
        try {
          const user = await getMe()
          setUser(user)
        } catch (error) {
          console.error('Failed to retrieve user profile on session check:', error)
        }
        return true
      }

      return false
    },
    staleTime: Infinity,
    retry: false,
  })
}
