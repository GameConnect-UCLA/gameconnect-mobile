import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer } from "expo-video";
import type { Attachment } from "@/src/types/chat.types";
import { formatDuration } from "./helpers";

interface AudioAttachmentProps {
  attachment: Attachment;
  isOwnMessage: boolean;
}

export default function AudioAttachment({
  attachment,
  isOwnMessage,
}: AudioAttachmentProps) {
  const player = useVideoPlayer(attachment.url, (p) => {
    p.loop = false;
  });
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (playing) {
      player.pause();
    } else {
      player.play();
    }
    setPlaying((p) => !p);
  };

  useEffect(() => {
    const sub = player.addListener("playingChange", ({ isPlaying }) => {
      setPlaying(isPlaying);
    });
    return () => sub.remove();
  }, [player]);

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.own : styles.other,
      ]}
    >
      <TouchableOpacity onPress={toggle} style={styles.playBtn}>
        <Ionicons
          name={playing ? "pause" : "play"}
          size={20}
          color={isOwnMessage ? "#033563" : "#fff"}
        />
      </TouchableOpacity>
      <View style={styles.wave}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: 4 + Math.sin(i * 0.8) * 8 + Math.cos(i * 1.3) * 4,
                backgroundColor: isOwnMessage
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(3,53,99,0.4)",
              },
            ]}
          />
        ))}
      </View>
      {attachment.duration !== undefined && (
        <Text
          style={[
            styles.duration,
            { color: isOwnMessage ? "rgba(255,255,255,0.8)" : "#666" },
          ]}
        >
          {formatDuration(attachment.duration)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    minWidth: 200,
  },
  own: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  other: {
    backgroundColor: "rgba(3,53,99,0.08)",
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 28,
  },
  bar: {
    width: 2.5,
    borderRadius: 2,
    flex: 1,
  },
  duration: {
    fontSize: 11,
    fontWeight: "600",
    minWidth: 32,
    textAlign: "right",
  },
});
