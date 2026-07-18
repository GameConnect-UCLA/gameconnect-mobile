/** Socket.io client for real-time chat. */
import { io, type Socket } from 'socket.io-client'
import { secureStore } from '@/src/core/lib/secure-store'

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

let socket: Socket | null = null

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
    console.log('Socket connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message)
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
