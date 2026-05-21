import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import type { Attachment } from "@/src/types/chat.types";
import { MEDIA_BORDER_RADIUS, FALLBACK_ASPECT_RATIO } from "./constants";

interface VideoAttachmentProps {
  attachment: Attachment;
  maxWidth: number;
}

export default function VideoAttachment({
  attachment,
  maxWidth,
}: VideoAttachmentProps) {
  const aspectRatio =
    attachment.width && attachment.height
      ? attachment.width / attachment.height
      : FALLBACK_ASPECT_RATIO;

  const height = maxWidth / aspectRatio;

  const player = useVideoPlayer(attachment.url, (p) => {
    p.loop = false;
    if (attachment.muted) p.muted = true;
    if (attachment.trim_start !== undefined)
      p.currentTime = attachment.trim_start;
  });

  useEffect(() => {
    if (attachment.trim_end === undefined) return;
    const sub = player.addListener("timeUpdate", ({ currentTime }) => {
      if (currentTime >= attachment.trim_end!) {
        player.pause();
        if (attachment.trim_start !== undefined)
          player.currentTime = attachment.trim_start;
      }
    });
    return () => sub.remove();
  }, [player, attachment.trim_end, attachment.trim_start]);

  return (
    <View style={[styles.container, { width: maxWidth, height }]}>
      <VideoView
        player={player}
        style={{ width: maxWidth, height }}
        nativeControls
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: MEDIA_BORDER_RADIUS,
    overflow: "hidden",
    backgroundColor: "#000",
  },
});
