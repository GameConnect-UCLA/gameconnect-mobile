/** Reply preview bar displayed above the chat input */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Message } from '../../types/chat.types';
import { Colors, Spacing, Typography } from '@/src/core/theme';

interface ReplyBarProps {
  message: Message;
  onCancel: () => void;
}

/** Show the message being replied to with a cancel button @param props.message - The message being replied to @param props.onCancel - Cancel reply handler */
export default function ReplyBar({ message, onCancel }: ReplyBarProps) {
  const replyPreview = message.message_text ?? (message.attached_media?.[0]?.url ?? "Media");

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
    marginHorizontal: Spacing.md,
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    paddingLeft: 0,
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    overflow: "hidden",
  },
  indicator: {
    width: 4,
    height: "100%",
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 2,
  },
  preview: {
    fontSize: Typography.sizes.sm,
    color: "#666",
  },
  closeButton: {
    padding: 6,
  },
});
