import { create } from 'zustand'
import type { Message } from '@/src/types/chat.types'

type ChatState = {
  blockedUserIds: string[]
  activeReplyMessage: Message | null
  activeMenuMessage: Message | null
  hiddenConversationIds: string[]
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
  setActiveReplyMessage: (message: Message | null) => void
  setActiveMenuMessage: (message: Message | null) => void
  hideConversation: (id: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  blockedUserIds: [],
  activeReplyMessage: null,
  activeMenuMessage: null,
  hiddenConversationIds: [],
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
  hideConversation: (id) =>
    set((state) => ({
      hiddenConversationIds: state.hiddenConversationIds.includes(id)
        ? state.hiddenConversationIds
        : [...state.hiddenConversationIds, id],
    })),
}))
