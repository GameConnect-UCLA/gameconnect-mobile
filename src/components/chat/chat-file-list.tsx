import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SharedFileItem } from "@/src/types/chat.types";

const FILE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "image/png": "image-outline",
  "image/jpeg": "image-outline",
  "video/mp4": "videocam-outline",
  "application/pdf": "document-text-outline",
  "text/plain": "document-text-outline",
};

interface ChatFileListProps {
  items: SharedFileItem[];
}

export default function ChatFileList({ items }: ChatFileListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay archivos compartidos</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <View style={styles.list}>
        {items.map((file) => (
          <View key={file.id} style={styles.fileRow}>
            <View style={styles.fileIcon}>
              <Ionicons
                name={FILE_ICONS[file.file_type] ?? "document-outline"}
                size={24}
                color="#033563"
              />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {file.filename}
              </Text>
              <Text style={styles.fileSize}>{file.file_size}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  list: {
    paddingVertical: 4,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(3, 53, 99, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  fileSize: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
