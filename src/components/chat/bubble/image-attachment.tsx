import React from "react";
import { Image, TouchableOpacity, StyleSheet, Text, View } from "react-native";
import type { Attachment } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";
import { useMediaDimensions } from "./use-media-dimensions";
import { MEDIA_BORDER_RADIUS } from "./constants";

interface ImageAttachmentProps {
  attachment: Attachment;
  maxWidth: number;
  onPress: () => void;
}

export default function ImageAttachment({
  attachment,
  maxWidth,
  onPress,
}: ImageAttachmentProps) {
  const { width, height } = useMediaDimensions(attachment, maxWidth);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.wrapper}
    >
      <Image
        source={{ uri: attachment.url }}
        style={{ width, height, backgroundColor: "#d0d0d0" }}
        resizeMode="cover"
      />
      {attachment.type === AttachmentType.GIF && (
        <View style={styles.gifBadge}>
          <Text style={styles.gifBadgeText}>GIF</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: MEDIA_BORDER_RADIUS,
    overflow: "hidden",
  },
  gifBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  gifBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
