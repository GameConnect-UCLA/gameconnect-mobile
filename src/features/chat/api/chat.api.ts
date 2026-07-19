/** API functions for chat conversations, messages, and group management */
import { apiClient } from '@/src/core/api/client'
import { useUserStore } from '@/src/core/store/user.store'
import { useChatStore } from '../store/chat.store'
import type { Attachment, Conversation, Message, GameInfoCard, ActiveUser } from '../types/chat.types'


/** Get the current user ID from the user store @returns Current user ID string */
export const getCurrentUserId = (): string => {
  const user = useUserStore.getState().user
  return user?.id ?? 'me'
}

/** Fetch all conversations for the current user @returns List of conversations */
export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await apiClient.get<Conversation[]>('/chat/conversations')
  return data
}

/** Get a single conversation by ID @param conversationId - Conversation UUID @returns The conversation with messages */
export const getConversation = async (conversationId: string): Promise<Conversation> => {
  const { data } = await apiClient.get<Conversation>(`/chat/conversations/${conversationId}`)
  return data
}

/** Send a message in a conversation @param conversationId - Target conversation @param messageText - Text content (nullable) @param attachments - Optional media @param senderId - Optional override @param replyToId - Optional message being replied to @param gameCard - Optional game card embed @returns The created message */
export const sendMessage = async (
  conversationId: string,
  messageText: string | null,
  attachments: Attachment[] | null = null,
  senderId?: string,
  replyToId?: string | null,
  gameCard?: GameInfoCard | null,
): Promise<Message> => {
  const { data } = await apiClient.post<Message>('/chat/conversations/send', {
    conversationId,
    messageText,
    attachments,
    senderId: senderId ?? getCurrentUserId(),
    replyToId,
    gameCard,
  })
  return data
}

export const deleteMessage = async (conversationId: string, messageId: string): Promise<void> => {
  await apiClient.post('/chat/conversations/delete-message', { conversationId, messageId })
}

export const clearChatHistory = async (conversationId: string): Promise<void> => {
  await apiClient.post('/chat/conversations/clear', { conversationId })
}

export const blockUser = async (userId: string): Promise<void> => {
  await apiClient.post('/chat/users/block', { userId })
  useChatStore.getState().blockUser(userId)
}

export const unblockUser = async (userId: string): Promise<void> => {
  await apiClient.post('/chat/users/unblock', { userId })
  useChatStore.getState().unblockUser(userId)
}

export const isBlocked = (userId: string): boolean => {
  return useChatStore.getState().blockedUserIds.includes(userId)
}

export const createGroup = async (name: string, groupPic: string | null, memberIds: string[]): Promise<Conversation> => {
  const { data } = await apiClient.post<Conversation>('/chat/groups', { name, groupPic, memberIds })
  return data
}

/** Start a new 1-on-1 conversation with a user @param userId - Target user ID @returns The new or existing conversation */
export const startConversation = async (userId: string): Promise<Conversation> => {
  const { data } = await apiClient.post<Conversation>('/chat/conversations/start', { userId })
  return data
}

/** Promote a group member to admin @param conversationId - Group conversation @param memberId - Member to promote */
export const promoteMember = async (conversationId: string, memberId: string): Promise<void> => {
  await apiClient.post('/chat/groups/promote', { conversationId, memberId })
}

/** Demote a group admin to member @param conversationId - Group conversation @param memberId - Member to demote */
export const demoteMember = async (conversationId: string, memberId: string): Promise<void> => {
  await apiClient.post('/chat/groups/demote', { conversationId, memberId })
}

/** Remove a member from a group @param conversationId - Group conversation @param memberId - Member to remove */
export const removeMember = async (conversationId: string, memberId: string): Promise<void> => {
  await apiClient.post('/chat/groups/remove-member', { conversationId, memberId })
}

/** Leave a group conversation @param conversationId - Group to leave */
export const leaveGroup = async (conversationId: string): Promise<void> => {
  await apiClient.post('/chat/groups/leave', { conversationId })
}

/** Add a user to a group conversation @param conversationId - Group conversation @param userId - User to add */
export const addMemberToGroup = async (conversationId: string, userId: string): Promise<void> => {
  await apiClient.post('/chat/groups/add-member', { conversationId, userId })
}

/** Transfer group ownership to another member @param conversationId - Group conversation @param memberId - New owner */
export const transferOwnership = async (conversationId: string, memberId: string): Promise<void> => {
  await apiClient.post('/chat/groups/transfer-ownership', { conversationId, memberId })
}

/** Search remote users via Meilisearch @param query Search query string @returns List of active users */
export const searchRemoteUsers = async (query: string): Promise<ActiveUser[]> => {
  const { data } = await apiClient.get<any[]>('/chat/users/search', {
    params: { q: query },
  })
  return (data ?? []).map((user: any) => ({
    id: user.id,
    username: user.username || user.displayName || 'Unknown',
    profilePic: user.profilePic || null,
  }))
}

