import * as mockChat from "../hooks/mock-data/mock-chat";
import type { Attachment, Conversation, Message } from "../types/chat.types";
import { AttachmentType, MessageType } from "../types/chat.types";
import { ApiError } from "./auth.api";

const simulateLatency = () => new Promise((res) => setTimeout(res, 800));

let mockIdCounter = 0;

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
  senderId: string = "current_user",
): Promise<Message> => {
  await simulateLatency();

  const conversation = mockChat.CONVERSATIONS.find(
    (c) => c.id === conversationId,
  );
  if (!conversation) throw new ApiError(404, "No existe la conversación");

  // Validate: AUDIO and DOCUMENT types should have no text
  const hasBlockingAttachments = attachments?.some(
    (att) => att.type === AttachmentType.AUDIO || att.type === AttachmentType.DOCUMENT,
  );
  if (hasBlockingAttachments && messageText) {
    throw new ApiError(400, "Audio and document messages cannot have text content");
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}-${mockIdCounter++}`,
    sent_by: senderId,
    conversation: conversationId,
    reply_to: null,
    type: conversation.is_group
      ? MessageType.GROUP_MESSAGE
      : MessageType.DIRECT_MESSAGE,
    message_text: messageText,
    attached_media: attachments,
    sent_at: new Date().toISOString(),
    sender_username: "You",
    sender_profile_pic: null,
  };

  console.log(`User sent message at ${newMessage.sent_at}:`);
  console.log(
    `id: ${newMessage.id}, conversation: ${newMessage.conversation}, text: "${newMessage.message_text ?? "[no text]"}", attachments: ${attachments?.length ?? 0}`,
  );

  // Update mock data for persistence within session
  conversation.messages = [...(conversation.messages || []), newMessage];
  conversation.last_message = messageText ?? (attachments?.[0]?.file_name || "[Media]");
  conversation.last_message_time = newMessage.sent_at;
  conversation.last_message_sender = senderId;

  console.log(`Last message: ${conversation.last_message}:`);
  return newMessage;
};
