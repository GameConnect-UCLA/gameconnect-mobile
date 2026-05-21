import * as mockChat from "../hooks/mock-data/mock-chat";
import type { Attachment, Conversation, GroupMember, Message } from "../types/chat.types";
import { AttachmentType, GroupRole, MessageType } from "../types/chat.types";
import { ApiError } from "./auth.api";
import { useUserStore } from "@/src/store/user.store";
import { useChatStore } from "@/src/store/chat.store";

const simulateLatency = () => new Promise((res) => setTimeout(res, 400));

let mockIdCounter = 0;

const getCurrentUserId = (): string => {
  const user = useUserStore.getState().user;
  return user?.id ?? "current_user";
};

export const getConversation = async (
  conversationId: string,
): Promise<Conversation> => {
  await simulateLatency();

  const conversations = mockChat.CONVERSATIONS;
  const conversation = conversations.find((c) => c.id === conversationId);

  if (!conversation) throw new ApiError(404, "No existe el contacto");

  return conversation;
};

export const sendMessage = async (
  conversationId: string,
  messageText: string | null,
  attachments: Attachment[] | null = null,
  senderId?: string,
  replyToId?: string | null,
): Promise<Message> => {
  await simulateLatency();

  const conversation = mockChat.CONVERSATIONS.find(
    (c) => c.id === conversationId,
  );
  if (!conversation) throw new ApiError(404, "No existe la conversación");

  const hasBlockingAttachments = attachments?.some(
    (att) => att.type === AttachmentType.AUDIO || att.type === AttachmentType.DOCUMENT,
  );
  if (hasBlockingAttachments && messageText) {
    throw new ApiError(400, "Audio and document messages cannot have text content");
  }

  const actualSenderId = senderId ?? getCurrentUserId();

  let replyToMessage: Message | null = null;
  if (replyToId) {
    replyToMessage = conversation.messages?.find((m) => m.id === replyToId) ?? null;
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}-${mockIdCounter++}`,
    sent_by: actualSenderId,
    conversation: conversationId,
    reply_to: replyToId ?? null,
    type: conversation.is_group
      ? MessageType.GROUP_MESSAGE
      : MessageType.DIRECT_MESSAGE,
    message_text: messageText,
    attached_media: attachments,
    sent_at: new Date().toISOString(),
    sender_username: "You",
    sender_profile_pic: null,
    reply_to_message: replyToMessage,
  };

  conversation.messages = [...(conversation.messages || []), newMessage];
  conversation.last_message = messageText ?? (attachments?.[0]?.file_name || "[Media]");
  conversation.last_message_time = newMessage.sent_at;
  conversation.last_message_sender = actualSenderId;

  return newMessage;
};

export const deleteMessage = async (
  conversationId: string,
  messageId: string,
): Promise<void> => {
  await simulateLatency();

  const conversation = mockChat.CONVERSATIONS.find(
    (c) => c.id === conversationId,
  );
  if (!conversation) throw new ApiError(404, "Conversation not found");

  if (conversation.messages) {
    conversation.messages = conversation.messages.filter(
      (m) => m.id !== messageId,
    );
  }
};

export const clearChatHistory = async (
  conversationId: string,
): Promise<void> => {
  await simulateLatency();

  const conversation = mockChat.CONVERSATIONS.find(
    (c) => c.id === conversationId,
  );
  if (!conversation) throw new ApiError(404, "Conversation not found");

  conversation.messages = [];
  conversation.last_message = undefined;
  conversation.last_message_time = undefined;
  conversation.last_message_sender = undefined;
};

export const blockUser = async (userId: string): Promise<void> => {
  await simulateLatency();
  useChatStore.getState().blockUser(userId);
};

export const unblockUser = async (userId: string): Promise<void> => {
  await simulateLatency();
  useChatStore.getState().unblockUser(userId);
};

export const isBlocked = (userId: string): boolean => {
  return useChatStore.getState().blockedUserIds.includes(userId);
};

export const createGroup = async (
  name: string,
  groupPic: string | null,
  memberIds: string[],
): Promise<Conversation> => {
  await simulateLatency();

  const currentUserId = getCurrentUserId();

  const members: GroupMember[] = [
    {
      id: `gm-${Date.now()}-owner`,
      user_id: currentUserId,
      conversation: "",
      role: GroupRole.OWNER,
      joined_at: new Date().toISOString(),
      left_at: null,
      username: "You",
      profile_pic: null,
    },
    ...memberIds.map((uid, i) => {
      const activeUser = mockChat.ACTIVE_USERS.find((u) => u.id === uid);
      return {
        id: `gm-${Date.now()}-${i}`,
        user_id: uid,
        conversation: "",
        role: GroupRole.MEMBER as GroupRole,
        joined_at: new Date().toISOString(),
        left_at: null,
        username: activeUser?.username ?? `User ${uid}`,
        profile_pic: activeUser?.profile_pic ?? null,
      };
    }),
  ];

  const newConversation: Conversation = {
    id: `convo-${Date.now()}`,
    name,
    group_picture: groupPic,
    created_by: currentUserId,
    created_at: new Date().toISOString(),
    member_count: members.length,
    is_group: true,
    last_message: undefined,
    last_message_time: undefined,
    last_message_sender: undefined,
    members,
    messages: [],
  };

  mockChat.CONVERSATIONS.push(newConversation);

  return newConversation;
};
