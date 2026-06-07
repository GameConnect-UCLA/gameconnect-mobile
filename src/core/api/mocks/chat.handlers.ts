import { mockRoutes } from './index'
import * as mockChat from '@/src/mocks/mock-chat'
import type { Conversation, GroupMember, Message } from '@/src/features/chat/types/chat.types'
import { GroupRole } from '@/src/features/chat/types/chat.types'

let mockIdCounter = 0

function getCurrentUserId(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useUserStore } = require('@/src/core/store/user.store')
    return useUserStore.getState().user?.id ?? 'current_user'
  } catch {
    return 'current_user'
  }
}

mockRoutes.set('/chat/conversations', () => {
  return [...mockChat.CONVERSATIONS]
})

mockRoutes.set('/chat/conversations/', (config) => {
  const conversationId = config.url?.replace('/chat/conversations/', '')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'No existe el contacto' }
  return conversation
})

mockRoutes.set('/chat/conversations/send', (config) => {
  const { conversationId, messageText, attachments, senderId, replyToId, gameCard } =
    JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'No existe la conversación' }

  const actualSenderId = senderId ?? getCurrentUserId()
  let replyToMessage: Message | null = null
  if (replyToId && conversation.messages) {
    replyToMessage = conversation.messages.find((m) => m.id === replyToId) ?? null
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}-${mockIdCounter++}`,
    sent_by: actualSenderId,
    conversation: conversationId,
    reply_to: replyToId ?? null,
    type: conversation.is_group ? ('GROUP_MESSAGE' as any) : ('DIRECT_MESSAGE' as any),
    message_text: messageText,
    attached_media: attachments ?? null,
    sent_at: new Date().toISOString(),
    sender_username: 'You',
    sender_profile_pic: null,
    reply_to_message: replyToMessage,
    game_card: gameCard ?? null,
  }

  conversation.messages = [...(conversation.messages || []), newMessage]
  conversation.last_message = messageText ?? '[Media]'
  conversation.last_message_time = newMessage.sent_at
  conversation.last_message_sender = newMessage.sender_username ?? actualSenderId

  return newMessage
})

mockRoutes.set('/chat/conversations/clear', (config) => {
  const { conversationId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  conversation.messages = []
  conversation.last_message = undefined
  conversation.last_message_time = undefined
  conversation.last_message_sender = undefined
  return { success: true }
})

mockRoutes.set('/chat/conversations/delete-message', (config) => {
  const { conversationId, messageId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  conversation.messages = (conversation.messages || []).filter((m) => m.id !== messageId)
  return { success: true }
})

mockRoutes.set('/chat/users/block', (config) => {
  const { userId } = JSON.parse(config.data || '{}')
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useChatStore } = require('@/src/features/chat/store/chat.store')
    useChatStore.getState().blockUser(userId)
  } catch {}
  return { success: true }
})

mockRoutes.set('/chat/users/unblock', (config) => {
  const { userId } = JSON.parse(config.data || '{}')
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useChatStore } = require('@/src/features/chat/store/chat.store')
    useChatStore.getState().unblockUser(userId)
  } catch {}
  return { success: true }
})

mockRoutes.set('/chat/groups', (config) => {
  const { name, groupPic, memberIds } = JSON.parse(config.data || '{}')
  const currentUserId = getCurrentUserId()

  const members: GroupMember[] = [
    {
      id: `gm-${Date.now()}-owner`,
      user_id: currentUserId,
      conversation: '',
      role: GroupRole.OWNER,
      joined_at: new Date().toISOString(),
      left_at: null,
      username: 'You',
      profile_pic: null,
    },
    ...(memberIds || []).map((uid: string, i: number) => {
      const activeUser = mockChat.ACTIVE_USERS.find((u) => u.id === uid)
      return {
        id: `gm-${Date.now()}-${i}`,
        user_id: uid,
        conversation: '',
        role: GroupRole.MEMBER,
        joined_at: new Date().toISOString(),
        left_at: null,
        username: activeUser?.username ?? `User ${uid}`,
        profile_pic: activeUser?.profile_pic ?? null,
      }
    }),
  ]

  const newConversation: Conversation = {
    id: `convo-${Date.now()}`,
    name,
    group_picture: groupPic ?? null,
    created_by: currentUserId,
    created_at: new Date().toISOString(),
    member_count: members.length,
    is_group: true,
    last_message: undefined,
    last_message_time: undefined,
    last_message_sender: undefined,
    members,
    messages: [],
  }

  mockChat.CONVERSATIONS.push(newConversation)
  return newConversation
})

mockRoutes.set('/chat/conversations/start', (config) => {
  const { userId } = JSON.parse(config.data || '{}')
  const currentUserId = getCurrentUserId()

  const existing = mockChat.CONVERSATIONS.find(
    (c) =>
      !c.is_group &&
      c.members?.some((m) => m.user_id === currentUserId) &&
      c.members?.some((m) => m.user_id === userId),
  )
  if (existing) return existing

  const activeUser = mockChat.ACTIVE_USERS.find((u) => u.id === userId)
  return {
    id: `convo-${Date.now()}`,
    name: activeUser?.username ?? `User ${userId}`,
    group_picture: null,
    created_by: currentUserId,
    created_at: new Date().toISOString(),
    member_count: 2,
    is_group: false,
    last_message: undefined,
    last_message_time: undefined,
    last_message_sender: undefined,
    members: [
      {
        id: `gm-${Date.now()}-owner`,
        user_id: currentUserId,
        conversation: '',
        role: GroupRole.OWNER,
        joined_at: new Date().toISOString(),
        left_at: null,
        username: 'You',
        profile_pic: null,
      },
      {
        id: `gm-${Date.now()}-target`,
        user_id: userId,
        conversation: '',
        role: GroupRole.MEMBER,
        joined_at: new Date().toISOString(),
        left_at: null,
        username: activeUser?.username ?? `User ${userId}`,
        profile_pic: activeUser?.profile_pic ?? null,
      },
    ],
    messages: [],
  }
})

mockRoutes.set('/chat/groups/promote', (config) => {
  const { conversationId, memberId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const member = conversation.members?.find((m) => m.id === memberId)
  if (!member) throw { status: 404, message: 'Member not found' }
  if (member.role === GroupRole.OWNER) throw { status: 400, message: 'Cannot promote owner' }
  member.role = GroupRole.ADMIN
  return { success: true }
})

mockRoutes.set('/chat/groups/demote', (config) => {
  const { conversationId, memberId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const member = conversation.members?.find((m) => m.id === memberId)
  if (!member) throw { status: 404, message: 'Member not found' }
  if (member.role === GroupRole.OWNER) throw { status: 400, message: 'Cannot demote owner' }
  member.role = GroupRole.MEMBER
  return { success: true }
})

mockRoutes.set('/chat/groups/remove-member', (config) => {
  const { conversationId, memberId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const member = conversation.members?.find((m) => m.id === memberId)
  if (!member) throw { status: 404, message: 'Member not found' }
  if (member.role === GroupRole.OWNER) throw { status: 400, message: 'Cannot remove owner' }
  conversation.members = conversation.members?.filter((m) => m.id !== memberId) ?? []
  if (conversation.member_count) conversation.member_count = Math.max(1, conversation.member_count - 1)
  return { success: true }
})

mockRoutes.set('/chat/groups/leave', (config) => {
  const { conversationId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const currentUserId = getCurrentUserId()
  conversation.members = conversation.members?.filter((m) => m.user_id !== currentUserId) ?? []
  if (conversation.member_count) conversation.member_count = Math.max(1, conversation.member_count - 1)
  return { success: true }
})

mockRoutes.set('/chat/groups/add-member', (config) => {
  const { conversationId, userId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const existing = conversation.members?.find((m) => m.user_id === userId)
  if (existing) throw { status: 400, message: 'User already in group' }
  const activeUser = mockChat.ACTIVE_USERS.find((u) => u.id === userId)
  const newMember: GroupMember = {
    id: `gm-${Date.now()}`,
    user_id: userId,
    conversation: '',
    role: GroupRole.MEMBER,
    joined_at: new Date().toISOString(),
    left_at: null,
    username: activeUser?.username ?? `User ${userId}`,
    profile_pic: activeUser?.profile_pic ?? null,
  }
  conversation.members = [...(conversation.members || []), newMember]
  if (conversation.member_count !== undefined) conversation.member_count += 1
  return { success: true }
})

mockRoutes.set('/chat/groups/transfer-ownership', (config) => {
  const { conversationId, memberId } = JSON.parse(config.data || '{}')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const currentUserId = getCurrentUserId()
  const currentOwner = conversation.members?.find(
    (m) => m.user_id === currentUserId && m.role === GroupRole.OWNER,
  )
  if (!currentOwner) throw { status: 403, message: 'Only owner can transfer ownership' }
  const newOwner = conversation.members?.find((m) => m.id === memberId)
  if (!newOwner) throw { status: 404, message: 'Member not found' }
  currentOwner.role = GroupRole.ADMIN
  newOwner.role = GroupRole.OWNER
  return { success: true }
})
