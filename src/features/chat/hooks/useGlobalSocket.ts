/** Global socket hook for real-time conversation list updates and online presence tracking */
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Conversation, Message } from '../types/chat.types'

/**
 * Global socket listener that mounts at the ChatList level.
 * - Listens for `message:new` and patches the conversations list cache
 * - Tracks `user:online` / `user:offline` for presence indicators
 * @returns { onlineUsers } — set of currently-online user IDs
 */
export function useGlobalSocket() {
  const queryClient = useQueryClient()
  const socketRef = useRef<any>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    let disposed = false

    async function init() {
      const { createSocket } = await import('@/src/core/api/socket')
      const s = await createSocket()

      if (disposed) return
      socketRef.current = s

      // --- message:new → patch ["conversations"] cache ---
      const handleNewMessage = (msg: Message) => {
        if (disposed) return
        console.log(
          `[WS Global] message:new for conversation ${msg.conversation}: "${msg.messageText ?? ''}"`,
        )

        queryClient.setQueryData(
          ['conversations'],
          (old: Conversation[] | undefined) => {
            if (!old) return old

            const idx = old.findIndex((c) => c.id === msg.conversation)
            if (idx === -1) {
              // Conversation not in cache — trigger a full refetch
              console.log('[WS Global] Conversation not in cache, invalidating')
              queryClient.invalidateQueries({ queryKey: ['conversations'] })
              return old
            }

            const updated = [...old]
            updated[idx] = {
              ...updated[idx],
              lastMessage: msg.messageText ?? '',
              lastMessageTime: msg.sentAt,
              lastMessageSender: msg.senderUsername ?? msg.sentBy,
            }
            return updated
          },
        )
      }

      // --- user:online ---
      const handleOnline = ({ userId }: { userId: string }) => {
        if (disposed) return
        console.log(`[WS Global] user:online: ${userId}`)
        setOnlineUsers((prev) =>
          prev.includes(userId) ? prev : [...prev, userId],
        )
      }

      // --- user:offline ---
      const handleOffline = ({ userId }: { userId: string }) => {
        if (disposed) return
        console.log(`[WS Global] user:offline: ${userId}`)
        setOnlineUsers((prev) => prev.filter((id) => id !== userId))
      }

      s.on('message:new', handleNewMessage)
      s.on('user:online', handleOnline)
      s.on('user:offline', handleOffline)

      console.log('[WS Global] Socket listeners registered, syncing presence...')
      s.emit('presence:sync')

      // Cleanup: remove only our specific handlers
      return () => {
        s.off('message:new', handleNewMessage)
        s.off('user:online', handleOnline)
        s.off('user:offline', handleOffline)
      }
    }

    let cleanup: (() => void) | undefined
    init().then((fn) => {
      cleanup = fn
    })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [queryClient])

  return { onlineUsers }
}
