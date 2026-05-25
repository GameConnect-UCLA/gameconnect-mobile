import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Message } from "@/src/types/chat.types";

interface ReplyBarProps {
  message: Message;
  onCancel: () => void;
}

export default function ReplyBar({ message, onCancel }: ReplyBarProps) {
  const replyPreview = message.message_text ?? (message.attached_media?.[0]?.file_name ?? "Media");

  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      <View style={styles.content}>
        <Text style={styles.username} numberOfLines={1}>
          {message.sender_username ?? "Unknown"}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {replyPreview}
        </Text>
      </View>
      <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
        <Ionicons name="close" size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    paddingLeft: 0,
    paddingRight: 8,
    paddingVertical: 8,
    overflow: "hidden",
  },
  indicator: {
    width: 4,
    height: "100%",
    backgroundColor: "#033563",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: 13,
    fontWeight: "600",
    color: "#033563",
    marginBottom: 2,
  },
  preview: {
    fontSize: 13,
    color: "#666",
  },
  closeButton: {
    padding: 6,
  },
});
