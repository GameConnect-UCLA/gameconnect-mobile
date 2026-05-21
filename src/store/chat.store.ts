import { create } from 'zustand'
import type { Message } from '@/src/types/chat.types'

type ChatState = {
  blockedUserIds: string[]
  activeReplyMessage: Message | null
  activeMenuMessage: Message | null
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
  setActiveReplyMessage: (message: Message | null) => void
  setActiveMenuMessage: (message: Message | null) => void
}

export const useChatStore = create<ChatState>((set) => ({
  blockedUserIds: [],
  activeReplyMessage: null,
  activeMenuMessage: null,
  blockUser: (userId) =>
    set((state) => ({
      blockedUserIds: state.blockedUserIds.includes(userId)
        ? state.blockedUserIds
        : [...state.blockedUserIds, userId],
    })),
  unblockUser: (userId) =>
    set((state) => ({
      blockedUserIds: state.blockedUserIds.filter((id) => id !== userId),
    })),
  setActiveReplyMessage: (message) => set({ activeReplyMessage: message }),
  setActiveMenuMessage: (message) => set({ activeMenuMessage: message }),
}))
