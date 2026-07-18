/** Real-time notification socket subscription (WebSocket or mock). */

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { USE_MOCKS } from '@/src/core/api/client'
import type { Notification } from '../types/notifications.types'

/** Subscribes to notification:new events and inserts them into the notifications query cache. */
export function useNotificationSocket() {
  const queryClient = useQueryClient()
  const cleanupRef = useRef<() => void>(() => { })

  useEffect(() => {
    let disposed = false

    async function init() {
      let s: any

      const { createSocket } = await import('@/src/core/api/socket')
      s = await createSocket()
      
      if (disposed) {
        if (s.disconnect) s.disconnect()
        return
      }

      s.on('notification:new', (notif: Notification) => {
        if (disposed) return
        queryClient.setQueryData(['notifications'], (old: Notification[] | undefined) => {
          if (!old) return [notif]
          if (old.some((n) => n.id === notif.id)) return old
          return [notif, ...old]
        })
      })

      cleanupRef.current = () => {
        if (USE_MOCKS) {
          if (s.removeAllListeners) s.removeAllListeners()
          if (s.disconnect) s.disconnect()
        } else {
          s.off('notification:new')
        }
      }
    }

    init()

    return () => {
      disposed = true
      cleanupRef.current()
    }
  }, [queryClient])
}
