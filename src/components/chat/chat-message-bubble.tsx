import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import type { Attachment, Message } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";

interface ChatMessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function VideoAttachmentPlayer({
  uri,
  style,
  autoPlay = false,
  trimStart,
  trimEnd,
  muted: isMuted,
}: {
  uri: string;
  style: View["props"]["style"];
  autoPlay?: boolean;
  trimStart?: number;
  trimEnd?: number;
  muted?: boolean;
}) {
  const player = useVideoPlayer(
    uri,
    (p) => {
      p.loop = false;
      if (isMuted) p.muted = true;
      if (trimStart !== undefined) {
        p.currentTime = trimStart;
      }
      if (autoPlay) {
        p.play();
        if (trimEnd !== undefined) {
          p.timeUpdateEventInterval = 0.1;
        }
      }
    }
  );

  useEffect(() => {
    if (trimEnd === undefined) return;
    const subscription = player.addListener("timeUpdate", (payload) => {
      if (payload.currentTime >= trimEnd) {
        player.pause();
        if (trimStart !== undefined) {
          player.currentTime = trimStart;
        }
      }
    });
    return () => subscription.remove();
  }, [player, trimEnd, trimStart]);

  return <VideoView player={player} style={style} nativeControls />;
}

function AttachmentPreview({
  attachment,
  isOwnMessage,
  onPress,
}: {
  attachment: Attachment;
  isOwnMessage: boolean;
  onPress: () => void;
}) {
  if (attachment.type === AttachmentType.IMAGE || attachment.type === AttachmentType.GIF) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image
          source={{ uri: attachment.url }}
          style={styles.imageAttachment}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  if (attachment.type === AttachmentType.VIDEO) {
    return (
      <View style={styles.videoContainer}>
        <VideoAttachmentPlayer
          uri={attachment.url}
          style={styles.videoAttachment}
          trimStart={attachment.trim_start}
          trimEnd={attachment.trim_end}
          muted={attachment.muted}
        />
      </View>
    );
  }

  if (attachment.type === AttachmentType.AUDIO) {
    return (
      <View
        style={[
          styles.audioContainer,
          isOwnMessage ? styles.ownAudioContainer : styles.otherAudioContainer,
        ]}
      >
        <Ionicons name="musical-note" size={24} color={isOwnMessage ? "#fff" : "#033563"} />
        <Text
          style={[
            styles.audioText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}
          numberOfLines={1}
        >
          {attachment.file_name || "Audio"}
        </Text>
        {attachment.duration && (
          <Text style={[styles.durationText, isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
            {Math.floor(attachment.duration / 60)}:{String(Math.floor(attachment.duration % 60)).padStart(2, "0")}
          </Text>
        )}
      </View>
    );
  }

  // Document
  return (
    <TouchableOpacity
      style={[
        styles.documentContainer,
        isOwnMessage ? styles.ownDocumentContainer : styles.otherDocumentContainer,
      ]}
      onPress={onPress}
    >
      <Ionicons name="document-text" size={32} color={isOwnMessage ? "#fff" : "#033563"} />
      <View style={styles.documentInfo}>
        <Text
          style={[
            styles.documentName,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
          ]}
          numberOfLines={2}
        >
          {attachment.file_name || "Document"}
        </Text>
        {attachment.file_size && (
          <Text style={[styles.documentSize, isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
            {formatFileSize(attachment.file_size)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function FullScreenViewer({
  attachment,
  visible,
  onClose,
}: {
  attachment: Attachment | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!attachment) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {attachment.type === AttachmentType.IMAGE || attachment.type === AttachmentType.GIF ? (
          <Image
            source={{ uri: attachment.url }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        ) : attachment.type === AttachmentType.VIDEO ? (
          <VideoAttachmentPlayer
            uri={attachment.url}
            style={styles.fullScreenVideo}
            autoPlay
            trimStart={attachment.trim_start}
            trimEnd={attachment.trim_end}
            muted={attachment.muted}
          />
        ) : (
          <View style={styles.fullScreenDocument}>
            <Ionicons name="document-text" size={80} color="#fff" />
            <Text style={styles.fullScreenFileName}>{attachment.file_name}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default function ChatMessageBubble({
  message,
  isOwnMessage,
}: ChatMessageBubbleProps) {
  const [fullScreenAttachment, setFullScreenAttachment] = useState<Attachment | null>(null);

  const handleAttachmentPress = useCallback((attachment: Attachment) => {
    setFullScreenAttachment(attachment);
  }, []);

  const hasAttachments = message.attached_media && message.attached_media.length > 0;
  const hasText = message.message_text && message.message_text.length > 0;

  return (
    <>
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
            hasAttachments && !hasText ? styles.mediaOnlyBubble : null,
          ]}
        >
          {hasAttachments && (
            <View style={styles.attachmentsContainer}>
              {message.attached_media!.map((attachment, index) => (
                <AttachmentPreview
                  key={index}
                  attachment={attachment}
                  isOwnMessage={isOwnMessage}
                  onPress={() => handleAttachmentPress(attachment)}
                />
              ))}
            </View>
          )}

          {hasText && (
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
              ]}
            >
              {message.message_text}
            </Text>
          )}

          <Text style={styles.messageTime}>
            {formatMessageTime(message.sent_at)}
          </Text>
        </View>
      </View>

      <FullScreenViewer
        attachment={fullScreenAttachment}
        visible={fullScreenAttachment !== null}
        onClose={() => setFullScreenAttachment(null)}
      />
    </>
  );
}

const { width: SCREEN_W } = Dimensions.get("window");
const ATTACHMENT_W = SCREEN_W * 0.55;

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 8,
    maxWidth: "80%",
  },
  messageRight: {
    alignSelf: "flex-end",
  },
  messageLeft: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownBubble: {
    backgroundColor: "#033563",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderBottomLeftRadius: 4,
  },
  mediaOnlyBubble: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#1a1a1a",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    color: "#999",
  },
  attachmentsContainer: {
    marginBottom: 8,
    gap: 8,
  },
  imageAttachment: {
    width: ATTACHMENT_W,
    height: ATTACHMENT_W * 0.75,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  videoContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  videoAttachment: {
    width: ATTACHMENT_W,
    height: ATTACHMENT_W * 0.75,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    minWidth: 180,
  },
  ownAudioContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  otherAudioContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  audioText: {
    fontSize: 14,
    flex: 1,
  },
  durationText: {
    fontSize: 12,
    opacity: 0.8,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    minWidth: ATTACHMENT_W,
  },
  ownDocumentContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  otherDocumentContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
  },
  documentSize: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  fullScreenVideo: {
    width: "100%",
    height: "70%",
  },
  fullScreenDocument: {
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreenFileName: {
    color: "#fff",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
});
