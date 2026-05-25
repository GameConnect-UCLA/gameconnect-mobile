import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MediaPreviewModalProps {
  visible: boolean;
  mediaUri: string;
  mediaType: "image" | "video";
  fileName?: string;
  recipientName?: string;
  onCancel: () => void;
  onMutedChange?: (muted: boolean) => void;
  children?: React.ReactNode;
}

export default function MediaPreviewModal({
  visible,
  mediaUri,
  mediaType,
  recipientName,
  onCancel,
  onMutedChange,
  children,
}: MediaPreviewModalProps) {
  const insets = useSafeAreaInsets();
  const [muted, setMuted] = useState(false);

  const player = useVideoPlayer(mediaUri);

  useEffect(() => {
    if (mediaType === "video" && player) {
      player.loop = true;
      player.play();
    }
    return () => {
      if (player) {
        try {
          player.pause();
        } catch {
          // Player may already be released when modal unmounts
        }
      }
    };
  }, [mediaType, player]);

  useEffect(() => {
    if (!visible) {
      setMuted(false);
    }
  }, [visible]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    player.muted = next;
    onMutedChange?.(next);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <View
          style={[
            styles.topBar,
            { paddingTop: insets.top, height: 56 + insets.top },
          ]}
        >
          <TouchableOpacity onPress={onCancel} style={styles.topBarButton}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          {recipientName ? (
            <Text style={styles.recipientName} numberOfLines={1}>
              Para: {recipientName}
            </Text>
          ) : (
            <View style={styles.topBarSpacer} />
          )}
          <View style={styles.topBarButton} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.previewArea}>
            {mediaType === "image" ? (
              <Image
                source={{ uri: mediaUri }}
                resizeMode="contain"
                style={styles.image}
              />
            ) : (
              <View style={styles.videoContainer}>
                <VideoView
                  player={player}
                  style={styles.video}
                  contentFit="contain"
                  nativeControls={false}
                />
                <TouchableOpacity
                  style={styles.muteButton}
                  onPress={toggleMute}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={muted ? "volume-mute" : "volume-high"}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View
            style={[styles.bottomWrapper, { paddingBottom: insets.bottom }]}
          >
            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
  topBarButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarSpacer: {
    width: 44,
  },
  recipientName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    flexShrink: 1,
  },
  previewArea: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  muteButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    borderRadius: 20,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  bottomWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingTop: 8,
  },
});
