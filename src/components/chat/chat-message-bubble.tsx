import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Message } from "@/src/types/chat.types";

interface ChatMessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatMessageBubble({
  message,
  isOwnMessage,
}: ChatMessageBubbleProps) {
  return (
    <View
      style={[
        styles.messageContainer,
        isOwnMessage ? styles.messageRight : styles.messageLeft,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {message.message_text}
        </Text>
        <Text style={styles.messageTime}>
          {formatMessageTime(message.sent_at)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 8,
    maxWidth: "80%",
  },
  messageRight: {
    alignSelf: "flex-end",
  },
  messageLeft: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownBubble: {
    backgroundColor: "#033563",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#1a1a1a",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    color: "#999",
  },
});
