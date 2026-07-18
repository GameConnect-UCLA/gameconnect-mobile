/** Checks if a stored session token exists on app launch. Runs once (staleTime: Infinity). */
import { secureStore } from '@/src/core/lib/secure-store'
import { useAuthStore } from '@/src/core/store/auth.store'
import { useQuery } from '@tanstack/react-query'

/** Reads stored access token on mount. If found, sets the auth store as authenticated.
 * @returns `UseQueryResult<boolean>` — `true` if a valid session exists, `false` otherwise.
 */
export const useSessionCheck = () => {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

  return useQuery({
    queryKey: ['sessionCheck'],
    queryFn: async () => {
      const token = await secureStore.get(secureStore.KEYS.ACCESS_TOKEN)
      console.log(token)
      if (token) {
        setAuthenticated(token)
        return true
      }

      return false
    },
    staleTime: Infinity,
    retry: false,
  })
}
