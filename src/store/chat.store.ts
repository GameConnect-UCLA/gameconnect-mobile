import { create } from 'zustand'

type ChatState = {
  blockedUserIds: string[]
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  blockedUserIds: [],
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
}))
