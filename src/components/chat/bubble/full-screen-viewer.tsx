import React from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Attachment } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";
import VideoAttachment from "./video-attachment";

interface FullScreenViewerProps {
  attachment: Attachment | null;
  visible: boolean;
  onClose: () => void;
}

export default function FullScreenViewer({
  attachment,
  visible,
  onClose,
}: FullScreenViewerProps) {
  const { width, height } = useWindowDimensions();
  if (!attachment) return null;

  const isMedia =
    attachment.type === AttachmentType.IMAGE ||
    attachment.type === AttachmentType.GIF;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        {isMedia ? (
          <Image
            source={{ uri: attachment.url }}
            style={{ width, height: height * 0.85 }}
            resizeMode="contain"
          />
        ) : attachment.type === AttachmentType.VIDEO ? (
          <VideoAttachment
            attachment={attachment}
            maxWidth={width}
          />
        ) : (
          <View style={styles.doc}>
            <Ionicons name="document-text" size={72} color="#fff" />
            <Text style={styles.docName}>{attachment.file_name}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  close: {
    position: "absolute",
    top: 52,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
  doc: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  docName: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});
