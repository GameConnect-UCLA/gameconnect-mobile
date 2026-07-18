/** Image/GIF attachment display within a message bubble */
import React from "react";
import { Image, TouchableOpacity, StyleSheet, Text, View } from "react-native";
import type { Attachment } from '../../types/chat.types';
import { AttachmentType } from '../../types/chat.types';
import { useMediaDimensions } from '../../hooks/useMediaDimensions';
import { MEDIA_BORDER_RADIUS } from "./constants";

interface ImageAttachmentProps {
  attachment: Attachment;
  maxWidth: number;
  onPress?: () => void;
}

/** Render an image or GIF with computed dimensions and GIF badge @param props.attachment - The attachment data @param props.maxWidth - Maximum display width @param props.onPress - Optional tap handler */
export default function ImageAttachment({
  attachment,
  maxWidth,
  onPress,
}: ImageAttachmentProps) {
  const { width, height } = useMediaDimensions(attachment, maxWidth);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      disabled={!onPress}
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
