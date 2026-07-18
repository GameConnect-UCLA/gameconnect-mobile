/** Thumbnail preview for selected attachments before sending */
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Attachment } from '../../types/chat.types';


interface MediaPreviewProps {
  attachments: Attachment[];
  onRemove: (index: number) => void;
}

/** Show selected-attachment thumbnails with remove buttons @param props.attachments - Array of selected attachments @param props.onRemove - Remove handler by index */
export default function MediaPreview({
  attachments,
  onRemove,
}: MediaPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <View style={styles.container}>
      {attachments.map((attachment, index) => (
        <View key={index} style={styles.previewItem}>
          <Image
            source={{ uri: attachment.url }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(index)}
          >
            <Ionicons name="close-circle" size={24} color="#B42318" />
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
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    zIndex: 1,
  },
});
