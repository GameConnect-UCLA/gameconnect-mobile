import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Message } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";

interface ReplyPreviewProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function ReplyPreview({
  message,
  isOwnMessage,
}: ReplyPreviewProps) {
  const hasMedia = message.attached_media && message.attached_media.length > 0;
  const firstMedia = hasMedia ? message.attached_media![0] : null;

  return (
    <View
      style={[
        styles.replyContainer,
        isOwnMessage ? styles.replyOwn : styles.replyOther,
      ]}
    >
      <View
        style={[
          styles.replyBar,
          {
            backgroundColor: isOwnMessage ? "rgba(255,255,255,0.6)" : "#033563",
          },
        ]}
      />
      <View style={styles.replyContent}>
        <Text
          style={[
            styles.replySender,
            { color: isOwnMessage ? "rgba(255,255,255,0.9)" : "#033563" },
          ]}
          numberOfLines={1}
        >
          {message.sender_username ?? "Unknown"}
        </Text>
        {message.message_text ? (
          <Text
            style={[
              styles.replyText,
              { color: isOwnMessage ? "rgba(255,255,255,0.75)" : "#555" },
            ]}
            numberOfLines={2}
          >
            {message.message_text}
          </Text>
        ) : hasMedia ? (
          <View style={styles.replyMediaRow}>
            <Ionicons
              name={
                firstMedia!.type === AttachmentType.VIDEO
                  ? "videocam"
                  : firstMedia!.type === AttachmentType.AUDIO
                    ? "musical-note"
                    : "image"
              }
              size={13}
              color={isOwnMessage ? "rgba(255,255,255,0.75)" : "#777"}
            />
            <Text
              style={[
                styles.replyText,
                { color: isOwnMessage ? "rgba(255,255,255,0.75)" : "#555" },
              ]}
            >
              {firstMedia!.type === AttachmentType.VIDEO
                ? "Video"
                : firstMedia!.type === AttachmentType.AUDIO
                  ? "Audio"
                  : "Imagen"}
            </Text>
          </View>
        ) : null}
      </View>
      {firstMedia &&
        (firstMedia.type === AttachmentType.IMAGE ||
          firstMedia.type === AttachmentType.GIF ||
          firstMedia.type === AttachmentType.VIDEO) && (
          <Image
            source={{ uri: firstMedia.thumbnail_url ?? firstMedia.url }}
            style={styles.replyThumbnail}
            resizeMode="cover"
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  replyContainer: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 6,
    overflow: "hidden",
    minHeight: 44,
    alignSelf: "stretch",
  },
  replyOwn: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  replyOther: {
    backgroundColor: "rgba(3,53,99,0.08)",
  },
  replyBar: {
    width: 3,
    borderRadius: 2,
    marginRight: 8,
  },
  replyContent: {
    flexShrink: 1,
    paddingVertical: 6,
    paddingRight: 6,
    justifyContent: "center",
  },
  replySender: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    lineHeight: 16,
  },
  replyMediaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  replyThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 6,
    margin: 6,
    backgroundColor: "#d0d0d0",
  },
});
