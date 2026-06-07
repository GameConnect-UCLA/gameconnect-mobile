/** Mock socket for development without a real server. */
import { ACTIVE_USERS } from '@/src/mocks/mock-chat'
import { mockNotifications } from '@/src/mocks/mock-notifications'

type Listener = (...args: any[]) => void

/** Emulates socket.io-client for local development with simulated events. */
class MockSocket {
  connected = false
  id = `mock-socket-${Date.now()}`
  private listeners = new Map<string, Set<Listener>>()
  private conversationId: string | null = null
  private timers: ReturnType<typeof setTimeout>[] = []

  constructor(conversationId?: string) {
    this.conversationId = conversationId ?? null
  }

  connect() {
    setTimeout(() => {
      this.connected = true
      this.emit('connect')

      if (this.conversationId) {
        this.setupChatSimulation()
      }

      this.setupNotificationSimulation()
    }, 100)
  }

  private setupChatSimulation() {
    const otherUserId = ACTIVE_USERS.find(
      (u) => u.id !== 'current_user',
    )?.id ?? 'user1'

    const t1 = setTimeout(() => {
      this.emit('user:online', { userId: otherUserId })
    }, 3000)
    this.timers.push(t1)

    const t2 = setTimeout(() => {
      this.emit('user:online', { userId: 'current_user' })
    }, 4000)
    this.timers.push(t2)
  }

  private setupNotificationSimulation() {
    const t = setInterval(() => {
      const notif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
      this.emit('notification:new', {
        ...notif,
        id: `mock-notif-${Date.now()}`,
        created_at: new Date().toISOString(),
        read: false,
      })
    }, 45000)
    this.timers.push(t)
  }

  private simulateTyping(userId: string) {
    this.emit('typing:update', { userId, isTyping: true })
    const t = setTimeout(() => {
      this.emit('typing:update', { userId, isTyping: false })
      this.emit('message:new', {
        id: `mock-msg-${Date.now()}`,
        sent_by: userId,
        conversation: this.conversationId,
        reply_to: null,
        type: this.conversationId?.includes('group') ? 'GROUP_MESSAGE' as any : 'DIRECT_MESSAGE' as any,
        message_text: 'Buen partido! 🎮',
        attached_media: null,
        sent_at: new Date().toISOString(),
        sender_username: 'Luna',
        sender_profile_pic: null,
        reply_to_message: null,
        game_card: null,
      })
    }, 3000)
    this.timers.push(t)
  }

  emit(event: string, ...args: any[]): boolean {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach((h) => h(...args))
    }

    if (event === 'message:send') {
      const data = args[0] ?? {}
      const otherUserId = ACTIVE_USERS.find(
        (u) => u.id !== data.sender_id,
      )?.id ?? 'user1'

      const t1 = setTimeout(() => this.simulateTyping(otherUserId), 800)
      this.timers.push(t1)
    }

    return true
  }

  on(event: string, handler: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(handler)
    return this
  }

  off(event: string, handler: Listener) {
    this.listeners.get(event)?.delete(handler)
    return this
  }

  removeAllListeners(event?: string) {
    if (event) this.listeners.delete(event)
    else this.listeners.clear()
  }

  disconnect() {
    this.connected = false
    this.timers.forEach(clearTimeout)
    this.timers = []
    this.listeners.clear()
  }
}

/** Create and connect a mock socket instance. @param conversationId Optional conversation to simulate. @returns MockSocket instance. */
export function createMockSocket(conversationId?: string) {
  const s = new MockSocket(conversationId)
  s.connect()
  return s
}
