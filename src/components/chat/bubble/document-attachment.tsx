import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Attachment } from "@/src/types/chat.types";
import { formatFileSize } from "./helpers";

interface DocumentAttachmentProps {
  attachment: Attachment;
  isOwnMessage: boolean;
}

export default function DocumentAttachment({
  attachment,
  isOwnMessage,
}: DocumentAttachmentProps) {
  const ext = attachment.file_name?.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.own : styles.other,
      ]}
    >
      <View style={[styles.icon, isOwnMessage ? styles.iconOwn : styles.iconOther]}>
        <Ionicons
          name="document-text"
          size={22}
          color={isOwnMessage ? "#033563" : "#fff"}
        />
        <Text style={[styles.ext, { color: isOwnMessage ? "#033563" : "#fff" }]}>
          {ext}
        </Text>
      </View>
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: isOwnMessage ? "#fff" : "#1a1a1a" },
          ]}
          numberOfLines={2}
        >
          {attachment.file_name ?? "Document"}
        </Text>
        {attachment.file_size !== undefined && (
          <Text style={[styles.size, { color: isOwnMessage ? "rgba(255,255,255,0.65)" : "#888" }]}>
            {formatFileSize(attachment.file_size)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    gap: 10,
    minWidth: 220,
  },
  own: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  other: {
    backgroundColor: "rgba(3,53,99,0.06)",
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconOwn: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  iconOther: {
    backgroundColor: "#033563",
  },
  ext: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginTop: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
  },
  size: {
    fontSize: 11,
    marginTop: 2,
  },
});
