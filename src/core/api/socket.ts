/** Socket.io client for real-time chat. */
import { io, type Socket } from 'socket.io-client'
import { secureStore } from '@/src/core/lib/secure-store'
import axios from 'axios'

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

let socket: Socket | null = null
let isRefreshingSocketToken = false

/** Create and connect a socket.io instance with auth token. @returns Connected Socket instance. */
export async function createSocket(): Promise<Socket> {
  if (socket?.connected) return socket

  const token = await secureStore.get(secureStore.KEYS.ACCESS_TOKEN)

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  socket.on('connect', () => {
    console.log('[WS Socket] Connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('[WS Socket] Disconnected:', reason)
  })

  socket.on('connect_error', async (error) => {
    console.error('[WS Socket] Connection error:', error.message)

    // If it's a JWT error, try refreshing the token once
    if (!isRefreshingSocketToken) {
      isRefreshingSocketToken = true
      try {
        const refreshToken = await secureStore.get(secureStore.KEYS.REFRESH_TOKEN)
        if (!refreshToken) {
          console.error('[WS Socket] No refresh token available, disconnecting')
          socket?.disconnect()
          return
        }

        const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_BASE_URL}/refresh`,
          { refreshToken }
        )

        const newToken = data.accessToken
        await secureStore.save(secureStore.KEYS.ACCESS_TOKEN, newToken)
        await secureStore.save(secureStore.KEYS.REFRESH_TOKEN, data.refreshToken)

        // Update socket auth and reconnect
        if (socket) {
          socket.auth = { token: newToken }
          console.log('[WS Socket] Token refreshed, reconnecting...')
          socket.connect()
        }
      } catch (refreshError) {
        console.error('[WS Socket] Token refresh failed, disconnecting:', refreshError)
        socket?.disconnect()
      } finally {
        isRefreshingSocketToken = false
      }
    }
  })

  return socket
}

/** Get the current socket instance (may be null). @returns Current Socket or null. */
export function getSocket(): Socket | null {
  return socket
}

/** Disconnect the current socket and clear the instance. */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
