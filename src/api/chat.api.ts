import * as mockChat from "../hooks/mock-data/mock-chat";
import { Conversation, Message, MessageType } from "../types/chat.types";
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
  messageText: string,
  senderId: string = "current_user",
): Promise<Message> => {
  await simulateLatency();

  const conversation = mockChat.CONVERSATIONS.find(
    (c) => c.id === conversationId,
  );
  if (!conversation) throw new ApiError(404, "No existe la conversación");

  const newMessage: Message = {
    id: `msg-${Date.now()}-${mockIdCounter++}`,
    sent_by: senderId,
    conversation: conversationId,
    reply_to: null,
    type: conversation.is_group
      ? MessageType.GROUP_MESSAGE
      : MessageType.DIRECT_MESSAGE,
    message_text: messageText,
    attached_media: null,
    sent_at: new Date().toISOString(),
    sender_username: "You",
    sender_profile_pic: null,
  };

  console.log(`User sent message at ${newMessage.sent_at}:`);
  console.log(
    `id: ${newMessage.id}, conversation: ${newMessage.conversation}, content: "${newMessage.message_text}"`,
  );

  // Update mock data for persistence within session
  conversation.messages = [...(conversation.messages || []), newMessage];
  conversation.last_message = messageText;
  conversation.last_message_time = newMessage.sent_at;
  conversation.last_message_sender = senderId;

  console.log(`Last message: ${conversation.last_message}:`);
  return newMessage;
};
