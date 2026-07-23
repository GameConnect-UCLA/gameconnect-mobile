import type { Conversation, GroupMember, Message } from '@/src/features/chat/types/chat.types'
import { GroupRole } from '@/src/features/chat/types/chat.types'
import * as mockChat from '@/src/mocks/mock-chat'
import { mockUsersList } from '@/src/mocks/mock-users-list'
import { mockRoutes } from './index'

let mockIdCounter = 0

function parseBody(config: { data?: unknown }) {
  const raw = config.data || '{}'
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

function parseSearchParams(config: { params?: Record<string, unknown>; url?: string }) {
  const searchParams = new URLSearchParams(
    typeof config.url === 'string' && config.url.includes('?')
      ? config.url.split('?')[1]
      : '',
  )

  return {
    q: String(config.params?.q ?? searchParams.get('q') ?? ''),
    type: String(config.params?.type ?? searchParams.get('type') ?? ''),
    limit: Number(config.params?.limit ?? searchParams.get('limit') ?? 10),
    offset: Number(config.params?.offset ?? searchParams.get('offset') ?? 0),
  }
}

function getCurrentUserId(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useUserStore } = require('@/src/core/store/user.store')
    return useUserStore.getState().user?.id ?? 'currentUser'
  } catch {
    return 'currentUser'
  }
}

mockRoutes.set('/chat/conversations', () => {
  return [...mockChat.CONVERSATIONS]
})

mockRoutes.set('/search', (config) => {
  const { q, type, limit, offset } = parseSearchParams(config)

  if (type !== 'user') {
    return {
      hits: [],
      total: 0,
      limit,
      offset,
    }
  }

  const normalizedQuery = q.trim().toLowerCase()
  const results = mockUsersList
    .map((user, index) => ({
      ...user,
      type: 'user' as const,
      searchableText: user.bio
        ? `${user.displayName} ${user.username} ${user.bio}`
        : `${user.displayName} ${user.username}`,
      rankingScore: index + 1,
      verified: false,
    }))
    .filter((user) => {
      if (!normalizedQuery) return true
      return [user.displayName, user.username, user.bio, user.searchableText]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    })

  const hits = results.slice(offset, offset + limit)

  return {
    hits,
    total: results.length,
    limit,
    offset,
  }
})

mockRoutes.set('/chat/conversations/', (config) => {
  const conversationId = config.url?.replace('/chat/conversations/', '')
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'No existe el contacto' }
  return conversation
})

mockRoutes.set('/chat/conversations/send', (config) => {
  const { conversationId, messageText, attachments, senderId, replyToId, gameCard } =
    parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'No existe la conversación' }

  const actualSenderId = senderId ?? getCurrentUserId()
  let replyToMessage: Message | null = null
  if (replyToId && conversation.messages) {
    replyToMessage = conversation.messages.find((m) => m.id === replyToId) ?? null
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}-${mockIdCounter++}`,
    sentBy: actualSenderId,
    conversation: conversationId,
    replyTo: replyToId ?? null,
    type: conversation.isGroup ? ('GROUP_MESSAGE' as any) : ('DIRECT_MESSAGE' as any),
    messageText: messageText,
    attachedMedia: attachments ?? null,
    sentAt: new Date().toISOString(),
    senderUsername: 'You',
    senderProfilePic: null,
    replyToMessage: replyToMessage,
    gameCard: gameCard ?? null,
  }

  conversation.messages = [...(conversation.messages || []), newMessage]
  conversation.lastMessage = messageText ?? '[Media]'
  conversation.lastMessageTime = newMessage.sentAt
  conversation.lastMessageSender = newMessage.senderUsername ?? actualSenderId

  return newMessage
})

mockRoutes.set('/chat/conversations/clear', (config) => {
  const { conversationId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  conversation.messages = []
  conversation.lastMessage = undefined
  conversation.lastMessageTime = undefined
  conversation.lastMessageSender = undefined
  return { success: true }
})

mockRoutes.set('/chat/conversations/delete-message', (config) => {
  const { conversationId, messageId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  conversation.messages = (conversation.messages || []).filter((m) => m.id !== messageId)
  return { success: true }
})

mockRoutes.set('/chat/users/block', (config) => {
  const { userId } = parseBody(config)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useChatStore } = require('@/src/features/chat/store/chat.store')
    useChatStore.getState().blockUser(userId)
  } catch {}
  return { success: true }
})

mockRoutes.set('/chat/users/unblock', (config) => {
  const { userId } = parseBody(config)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useChatStore } = require('@/src/features/chat/store/chat.store')
    useChatStore.getState().unblockUser(userId)
  } catch {}
  return { success: true }
})

mockRoutes.set('/chat/groups', (config) => {
  const { name, groupPic, memberIds } = parseBody(config)
  const currentUserId = getCurrentUserId()

  const members: GroupMember[] = [
    {
      id: `gm-${Date.now()}-owner`,
      userId: currentUserId,
      conversation: '',
      role: GroupRole.OWNER,
      joinedAt: new Date().toISOString(),
      leftAt: null,
      username: 'You',
      profilePic: null,
    },
    ...(memberIds || []).map((uid: string, i: number) => {
      const activeUser = mockChat.ACTIVE_USERS.find((u) => u.id === uid)
      return {
        id: `gm-${Date.now()}-${i}`,
        userId: uid,
        conversation: '',
        role: GroupRole.MEMBER,
        joinedAt: new Date().toISOString(),
        leftAt: null,
        username: activeUser?.username ?? `User ${uid}`,
        profilePic: activeUser?.profilePic ?? null,
      }
    }),
  ]

  const newConversation: Conversation = {
    id: `convo-${Date.now()}`,
    name,
    groupPicture: groupPic ?? null,
    createdBy: currentUserId,
    createdAt: new Date().toISOString(),
    memberCount: members.length,
    isGroup: true,
    lastMessage: undefined,
    lastMessageTime: undefined,
    lastMessageSender: undefined,
    members,
    messages: [],
  }

  mockChat.CONVERSATIONS.push(newConversation)
  return newConversation
})

mockRoutes.set('/chat/conversations/start', (config) => {
  const { userId } = parseBody(config)
  const currentUserId = getCurrentUserId()

  const existing = mockChat.CONVERSATIONS.find(
    (c) =>
      !c.isGroup &&
      c.members?.some((m) => m.userId === currentUserId) &&
      c.members?.some((m) => m.userId === userId),
  )
  if (existing) return existing

  const activeUser = mockChat.ACTIVE_USERS.find((u) => u.id === userId)
  return {
    id: `convo-${Date.now()}`,
    name: activeUser?.username ?? `User ${userId}`,
    groupPicture: null,
    createdBy: currentUserId,
    createdAt: new Date().toISOString(),
    memberCount: 2,
    isGroup: false,
    lastMessage: undefined,
    lastMessageTime: undefined,
    lastMessageSender: undefined,
    members: [
      {
        id: `gm-${Date.now()}-owner`,
        userId: currentUserId,
        conversation: '',
        role: GroupRole.OWNER,
        joinedAt: new Date().toISOString(),
        leftAt: null,
        username: 'You',
        profilePic: null,
      },
      {
        id: `gm-${Date.now()}-target`,
        userId: userId,
        conversation: '',
        role: GroupRole.MEMBER,
        joinedAt: new Date().toISOString(),
        leftAt: null,
        username: activeUser?.username ?? `User ${userId}`,
        profilePic: activeUser?.profilePic ?? null,
      },
    ],
    messages: [],
  }
})

mockRoutes.set('/chat/groups/promote', (config) => {
  const { conversationId, memberId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const member = conversation.members?.find((m) => m.id === memberId)
  if (!member) throw { status: 404, message: 'Member not found' }
  if (member.role === GroupRole.OWNER) throw { status: 400, message: 'Cannot promote owner' }
  member.role = GroupRole.ADMIN
  return { success: true }
})

mockRoutes.set('/chat/groups/demote', (config) => {
  const { conversationId, memberId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const member = conversation.members?.find((m) => m.id === memberId)
  if (!member) throw { status: 404, message: 'Member not found' }
  if (member.role === GroupRole.OWNER) throw { status: 400, message: 'Cannot demote owner' }
  member.role = GroupRole.MEMBER
  return { success: true }
})

mockRoutes.set('/chat/groups/remove-member', (config) => {
  const { conversationId, memberId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const member = conversation.members?.find((m) => m.id === memberId)
  if (!member) throw { status: 404, message: 'Member not found' }
  if (member.role === GroupRole.OWNER) throw { status: 400, message: 'Cannot remove owner' }
  conversation.members = conversation.members?.filter((m) => m.id !== memberId) ?? []
  if (conversation.memberCount) conversation.memberCount = Math.max(1, conversation.memberCount - 1)
  return { success: true }
})

mockRoutes.set('/chat/groups/leave', (config) => {
  const { conversationId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const currentUserId = getCurrentUserId()
  conversation.members = conversation.members?.filter((m) => m.userId !== currentUserId) ?? []
  if (conversation.memberCount) conversation.memberCount = Math.max(1, conversation.memberCount - 1)
  return { success: true }
})

mockRoutes.set('/chat/groups/add-member', (config) => {
  const { conversationId, userId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const existing = conversation.members?.find((m) => m.userId === userId)
  if (existing) throw { status: 400, message: 'User already in group' }
  const activeUser = mockChat.ACTIVE_USERS.find((u) => u.id === userId)
  const newMember: GroupMember = {
    id: `gm-${Date.now()}`,
    userId: userId,
    conversation: '',
    role: GroupRole.MEMBER,
    joinedAt: new Date().toISOString(),
    leftAt: null,
    username: activeUser?.username ?? `User ${userId}`,
    profilePic: activeUser?.profilePic ?? null,
  }
  conversation.members = [...(conversation.members || []), newMember]
  if (conversation.memberCount !== undefined) conversation.memberCount += 1
  return { success: true }
})

mockRoutes.set('/chat/groups/transfer-ownership', (config) => {
  const { conversationId, memberId } = parseBody(config)
  const conversation = mockChat.CONVERSATIONS.find((c) => c.id === conversationId)
  if (!conversation) throw { status: 404, message: 'Conversation not found' }
  const currentUserId = getCurrentUserId()
  const currentOwner = conversation.members?.find(
    (m) => m.userId === currentUserId && m.role === GroupRole.OWNER,
  )
  if (!currentOwner) throw { status: 403, message: 'Only owner can transfer ownership' }
  const newOwner = conversation.members?.find((m) => m.id === memberId)
  if (!newOwner) throw { status: 404, message: 'Member not found' }
  currentOwner.role = GroupRole.ADMIN
  newOwner.role = GroupRole.OWNER
  return { success: true }
})
