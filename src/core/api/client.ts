/** Axios HTTP client with JWT interceptor and mock setup. */
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/src/core/store/auth.store'
import { secureStore } from '../lib/secure-store'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// 2. Definimos el tipo de los elementos que guardaremos en la cola de espera
interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: any) => void
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
export const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false'

// eslint-disable-next-line import/no-named-as-default-member
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Variables de control para la cola de refresco (Mantener fuera de los interceptores)
let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// para enviar el token en el header
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de Response
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Casteamos el config a nuestra interfaz personalizada
    const originalRequest = error.config as CustomAxiosRequestConfig

    // Verificamos que originalRequest exista para evitar errores si la petición falló drásticamente
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const currentRefreshToken = await secureStore.get(secureStore.KEYS.REFRESH_TOKEN)

        // Tipamos la respuesta esperada del backend de forma genérica
        const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_BASE_URL}/refresh`, 
          { refreshToken: currentRefreshToken }
        )

        const newToken = data.accessToken
        const newRefreshToken = data.refreshToken

        secureStore.save(secureStore.KEYS.REFRESH_TOKEN, newRefreshToken);
        secureStore.save(secureStore.KEYS.ACCESS_TOKEN, newToken);

        useAuthStore.getState().setAuthenticated(newToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        processQueue(null, newToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        secureStore.clearAll()
        useAuthStore.getState().reset()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

if (false && USE_MOCKS) {
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./mocks/users.handlers')
}

/** Axios instance with JWT auth interceptor and auto-refresh on 401. */
export { apiClient }
