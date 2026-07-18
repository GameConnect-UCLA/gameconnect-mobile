/** Zustand store for chat-level client state */
import { create } from 'zustand'

/** Chat client state: blocked/hidden conversations and reply tracking */
type ChatState = {
  blockedUserIds: string[]
  hiddenConversationIds: string[]
  replyMessage: string | null
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
  hideConversation: (id: string) => void
  setReplyMessage: (msg: string | null) => void
}

/** Zustand store hook for chat state @returns { ChatState } Blocked, hidden, reply actions */
export const useChatStore = create<ChatState>((set) => ({
  blockedUserIds: [],
  hiddenConversationIds: [],
  replyMessage: null,
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
  hideConversation: (id) =>
    set((state) => ({
      hiddenConversationIds: state.hiddenConversationIds.includes(id)
        ? state.hiddenConversationIds
        : [...state.hiddenConversationIds, id],
    })),
  setReplyMessage: (msg) => set({ replyMessage: msg }),
}))
