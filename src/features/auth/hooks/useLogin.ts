/** Handles login mutation: sends credentials, persists tokens to secure-store, sets auth state. */
import { authApi, ApiError } from '../api/auth.api'
import { secureStore } from '@/src/core/lib/secure-store'
import { useAuthStore } from '@/src/core/store/auth.store'
import { useUserStore } from '@/src/core/store/user.store'
import { type AuthError, type LoginCredentials } from '../types/auth.types'
import { useMutation } from '@tanstack/react-query'

const mapToAuthError = (e: unknown): AuthError => {
  if (e instanceof ApiError) {
    if (e.status === 401) return 'INVALID_CREDENTIALS'
    if (e.status >= 500) return 'SERVER_ERROR'
  }
  return 'NETWORK_ERROR'
}

export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  NETWORK_ERROR: 'Sin conexión, intenta de nuevo',
  SERVER_ERROR: 'Error del servidor, intenta más tarde',
}

/** Returns a mutation that logs in the user, persists JWT tokens, and sets auth store.
 * @returns A `useMutation` result with `mutate(credentials)`. On success, navigates to tabs.
 */
export const useLogin = () => {
  const { setAuthenticated } = useAuthStore()
  const { setUser } = useUserStore()
  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const { access_token, refresh_token, user } =
          await authApi.login(credentials)
        await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, access_token)
        await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, refresh_token)
        setAuthenticated(access_token)
        setUser(user)
      } catch (error) {
        throw Error(ERROR_MESSAGES[mapToAuthError(error)])
      }
    },
    onError: () => {
      secureStore.clearAll()
    },
  })

  return mutation
}
