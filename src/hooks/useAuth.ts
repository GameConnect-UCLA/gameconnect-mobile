import { authApi, ApiError } from '@/src/api/auth.api'
import { secureStore } from '@/src/lib/secure-store'
import { useAuthStore } from '@/src/store/auth.store'
import type { AuthError, LoginCredentials } from '@/src/types/auth.types'
import { User } from '../types/user.types'

const mapToAuthError = (e: unknown): AuthError => {
  if (e instanceof ApiError) {
    if (e.status === 401) return 'INVALID_CREDENTIALS'
    if (e.status >= 500) return 'SERVER_ERROR'
  }
  return 'NETWORK_ERROR'
}

export const useAuth = () => {
  const { setAuthenticated, setError, setLoading, reset } = useAuthStore()

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const { accessToken, refreshToken } = await authApi.login(credentials)
      await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, accessToken)
      await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, refreshToken)
      setAuthenticated(accessToken)
      return true
    } catch (e) {
      await secureStore.clearAll()
      setError(mapToAuthError(e))
      return false
    }
  }

  const register = async (user: Partial<User>): Promise<boolean> => {
    setLoading(true)
    try {
      const { accessToken, refreshToken } = await authApi.register(user)
      await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, accessToken)
      await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, refreshToken)
      setAuthenticated(accessToken)
      return true
    } catch (e) {
      await secureStore.clearAll()
      setError(mapToAuthError(e))
      return false
    }
  }

  const logout = async (): Promise<void> => {
    reset()
    await secureStore.clearAll()
  }

  return { login, register, logout }
}
