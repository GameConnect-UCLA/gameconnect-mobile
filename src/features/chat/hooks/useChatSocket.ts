/** Hook for real-time WebSocket chat events */
import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { USE_MOCKS } from '@/src/core/api/client'
import { useUserStore } from '@/src/core/store/user.store'
import type { Conversation, Message, Attachment, GameInfoCard } from '../types/chat.types'

/** Manage real-time socket connection for a conversation @param conversationId - Room to join @returns { sendMessage, startTyping, stopTyping, typingUsers, onlineUsers, isConnected } */
export function useChatSocket(conversationId: string) {
  const queryClient = useQueryClient()
  const currentUserId = useUserStore((s) => s.user?.id ?? 'current_user')
  const socketRef = useRef<any>(null)
  const cleanupRef = useRef<() => void>(() => {})

  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    let disposed = false

    async function init() {
      let s: any

      if (USE_MOCKS) {
        const { createMockSocket } = await import('@/src/core/api/mock-socket')
        s = createMockSocket(conversationId)
      } else {
        const { createSocket } = await import('@/src/core/api/socket')
        s = await createSocket()
        s.emit('room:join', { conversation_id: conversationId })
      }

      if (disposed) {
        if (s.disconnect) s.disconnect()
        return
      }

      socketRef.current = s

      s.on('connect', () => {
        if (!disposed) setIsConnected(true)
      })

      s.on('disconnect', () => {
        if (!disposed) setIsConnected(false)
      })

      s.on('message:new', (msg: Message) => {
        if (disposed) return
        queryClient.setQueryData(['conversation', conversationId], (old: Conversation | undefined) => {
          if (!old) return old
          if (old.messages?.some((m) => m.id === msg.id)) return old
          return { ...old, messages: [...(old.messages || []), msg] }
        })
      })

      s.on('typing:update', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
        if (disposed) return
        setTypingUsers((prev) => {
          if (isTyping && !prev.includes(userId)) return [...prev, userId]
          if (!isTyping) return prev.filter((id) => id !== userId)
          return prev
        })
      })

      s.on('user:online', ({ userId }: { userId: string }) => {
        if (disposed) return
        setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]))
      })

      s.on('user:offline', ({ userId }: { userId: string }) => {
        if (disposed) return
        setOnlineUsers((prev) => prev.filter((id) => id !== userId))
      })

      cleanupRef.current = () => {
        if (USE_MOCKS) {
          if (s.removeAllListeners) s.removeAllListeners()
          if (s.disconnect) s.disconnect()
        } else {
          s.off('connect')
          s.off('disconnect')
          s.off('message:new')
          s.off('typing:update')
          s.off('user:online')
          s.off('user:offline')
          s.emit('room:leave', { conversation_id: conversationId })
        }
      }
    }

    init()

    return () => {
      disposed = true
      cleanupRef.current()
    }
  }, [conversationId, queryClient])

  const sendMessage = useCallback(
    (
      text: string | null,
      attachments?: Attachment[] | null,
      replyToId?: string | null,
      gameCard?: GameInfoCard | null,
    ) => {
      if (!socketRef.current) return
      socketRef.current.emit('message:send', {
        conversation_id: conversationId,
        message_text: text,
        attachments,
        reply_to: replyToId,
        game_card: gameCard,
        sender_id: currentUserId,
      })
    },
    [conversationId, currentUserId],
  )

  const startTyping = useCallback(() => {
    socketRef.current?.emit('typing:start', { conversation_id: conversationId })
  }, [conversationId])

  const stopTyping = useCallback(() => {
    socketRef.current?.emit('typing:stop', { conversation_id: conversationId })
  }, [conversationId])

  return { sendMessage, startTyping, stopTyping, typingUsers, onlineUsers, isConnected }
}
