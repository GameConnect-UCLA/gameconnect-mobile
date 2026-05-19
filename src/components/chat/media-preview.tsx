import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Attachment } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";

interface MediaPreviewProps {
  attachments: Attachment[];
  onRemove: (index: number) => void;
}

function getAttachmentIcon(type: AttachmentType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case AttachmentType.IMAGE:
    case AttachmentType.GIF:
      return "image";
    case AttachmentType.VIDEO:
      return "videocam";
    case AttachmentType.AUDIO:
      return "musical-note";
    case AttachmentType.DOCUMENT:
      return "document-text";
    default:
      return "attach";
  }
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPreview({
  attachments,
  onRemove,
}: MediaPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <View style={styles.container}>
      {attachments.map((attachment, index) => (
        <View key={index} style={styles.previewItem}>
          {attachment.type === AttachmentType.IMAGE ||
          attachment.type === AttachmentType.GIF ? (
            <Image
              source={{ uri: attachment.url }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.filePreview}>
              <Ionicons
                name={getAttachmentIcon(attachment.type)}
                size={32}
                color="#033563"
              />
              <Text style={styles.fileName} numberOfLines={1}>
                {attachment.file_name || "Unnamed file"}
              </Text>
              {attachment.file_size && (
                <Text style={styles.fileSize}>
                  {formatFileSize(attachment.file_size)}
                </Text>
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(index)}
          >
            <Ionicons name="close-circle" size={24} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  previewItem: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  filePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#e8e8e8",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  fileName: {
    fontSize: 10,
    color: "#1a1a1a",
    marginTop: 4,
    textAlign: "center",
  },
  fileSize: {
    fontSize: 9,
    color: "#888",
    marginTop: 2,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    zIndex: 1,
  },
});
