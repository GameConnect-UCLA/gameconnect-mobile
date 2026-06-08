/** Axios HTTP client with JWT interceptor and mock setup. */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { secureStore } from '@/src/core/lib/secure-store'
import { useAuthStore } from '@/src/core/store/auth.store'
import { useUserStore } from '@/src/core/store/user.store'
import { ApiError } from './ApiError'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
export const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false'

// eslint-disable-next-line import/no-named-as-default-member
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig | undefined
    if (!originalRequest) return Promise.reject(normalizeError(error))
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(normalizeError(error))
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = await secureStore.get(secureStore.KEYS.REFRESH_TOKEN)
      if (!refreshToken) throw new Error('No refresh token')

      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      })

      await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, data.access_token)
      await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, data.refresh_token)
      useAuthStore.getState().setAuthenticated(data.access_token)
      processQueue(null, data.access_token)

      originalRequest.headers.Authorization = `Bearer ${data.access_token}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      await secureStore.clearAll()
      useAuthStore.getState().reset()
      useUserStore.getState().clearUser()
      return Promise.reject(
        refreshError instanceof ApiError
          ? refreshError
          : ApiError.unauthorized('Session expired'),
      )
    } finally {
      isRefreshing = false
    }
  },
)

function normalizeError(error: unknown): Error {
  if (error instanceof AxiosError) {
    if (error.code === 'ERR_NETWORK') return ApiError.network()
    const status = error.response?.status ?? 0
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      'Unknown error'
    return new ApiError(status, message)
  }
  if (error instanceof Error) return error
  return new Error('Unknown error')
}

if (USE_MOCKS) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { setupMocks } = require('./mocks')
  setupMocks(apiClient, API_BASE_URL)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./mocks/auth.handlers')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./mocks/chat.handlers')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./mocks/game.handlers')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./mocks/notifications.handlers')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./mocks/posts.handlers')
}

/** Axios instance with JWT auth interceptor and auto-refresh on 401. */
export { apiClient }
