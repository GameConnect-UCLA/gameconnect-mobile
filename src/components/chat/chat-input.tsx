import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import type { Attachment } from "@/src/types/chat.types";
import { AttachmentType } from "@/src/types/chat.types";
import MediaPreview from "./media-preview";

const MAX_INPUT_HEIGHT = 120;
const BASE_LINE_HEIGHT = 40;
const MAX_ATTACHMENTS = 5;

interface ChatInputProps {
  onSend: (text: string | null, attachments?: Attachment[] | null) => void;
  onHeightChange?: (height: number) => void;
}

export default function ChatInput({ onSend, onHeightChange }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(BASE_LINE_HEIGHT);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  useEffect(() => {
    if (message === "" && attachments.length === 0) {
      setInputHeight(BASE_LINE_HEIGHT);
      onHeightChange?.(BASE_LINE_HEIGHT + 16);
    }
  }, [message, attachments.length, onHeightChange]);

  const handleSend = () => {
    const text = message.trim() || null;
    const hasAttachments = attachments.length > 0;

    // Validate: can't send empty message
    if (!text && !hasAttachments) return;

    // Validate: AUDIO and DOCUMENT types block text
    const hasBlockingAttachments = attachments.some(
      (att) => att.type === AttachmentType.AUDIO || att.type === AttachmentType.DOCUMENT
    );
    if (hasBlockingAttachments && text) {
      Alert.alert(
        "Invalid Message",
        "Audio and document messages cannot have text content."
      );
      return;
    }

    onSend(text, hasAttachments ? attachments : null);
    setMessage("");
    setAttachments([]);
    setShowAttachmentMenu(false);
  };

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const newHeight = Math.min(
        Math.max(event.nativeEvent.contentSize.height, BASE_LINE_HEIGHT),
        MAX_INPUT_HEIGHT
      );
      setInputHeight(newHeight);
      onHeightChange?.(newHeight + 16);
    },
    [onHeightChange]
  );

  const pickImage = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      Alert.alert("Limit Reached", `Maximum ${MAX_ATTACHMENTS} attachments allowed.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const file = new File(asset.uri);
      const exists = file.exists;

      const newAttachment: Attachment = {
        url: asset.uri,
        type: AttachmentType.IMAGE,
        file_name: asset.fileName || `image_${Date.now()}.jpg`,
        file_size: exists ? file.size : asset.fileSize,
        mime_type: asset.mimeType || "image/jpeg",
        width: asset.width,
        height: asset.height,
      };

      setAttachments((prev) => [...prev, newAttachment]);
    }
    setShowAttachmentMenu(false);
  };

  const pickVideo = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      Alert.alert("Limit Reached", `Maximum ${MAX_ATTACHMENTS} attachments allowed.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const file = new File(asset.uri);
      const exists = file.exists;

      const newAttachment: Attachment = {
        url: asset.uri,
        type: AttachmentType.VIDEO,
        file_name: asset.fileName || `video_${Date.now()}.mp4`,
        file_size: exists ? file.size : asset.fileSize,
        mime_type: asset.mimeType || "video/mp4",
        width: asset.width,
        height: asset.height,
        duration: asset.duration ?? undefined,
      };

      setAttachments((prev) => [...prev, newAttachment]);
    }
    setShowAttachmentMenu(false);
  };

  const pickDocument = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      Alert.alert("Limit Reached", `Maximum ${MAX_ATTACHMENTS} attachments allowed.`);
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      const file = new File(asset.uri);
      const exists = file.exists;

      const newAttachment: Attachment = {
        url: asset.uri,
        type: AttachmentType.DOCUMENT,
        file_name: asset.name,
        file_size: exists ? file.size : undefined,
        mime_type: asset.mimeType,
      };

      setAttachments((prev) => [...prev, newAttachment]);
    }
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const hasBlockingAttachments = attachments.some(
    (att) => att.type === AttachmentType.AUDIO || att.type === AttachmentType.DOCUMENT
  );

  const canSend = message.trim().length > 0 || attachments.length > 0;
  const showSendIcon = canSend;

  return (
    <View>
      {attachments.length > 0 && (
        <MediaPreview attachments={attachments} onRemove={removeAttachment} />
      )}

      {showAttachmentMenu && (
        <View style={styles.attachmentMenu}>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#033563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickVideo}>
            <Ionicons name="videocam" size={24} color="#033563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickDocument}>
            <Ionicons name="document-text" size={24} color="#033563" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
        >
          <Ionicons
            name={showAttachmentMenu ? "close" : "add-circle-outline"}
            size={26}
            color="#888"
          />
        </TouchableOpacity>

        <TextInput
          style={[styles.textInput, { height: inputHeight }]}
          placeholder={hasBlockingAttachments ? "Audio/Document only" : "Message"}
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
          onContentSizeChange={handleContentSizeChange}
          maxLength={2000}
          editable={!hasBlockingAttachments}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          activeOpacity={0.7}
          disabled={!canSend}
        >
          <Ionicons
            name={showSendIcon ? "send" : "mic-outline"}
            size={26}
            color={showSendIcon ? "#033563" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 12,
    backgroundColor: "#e8e8e8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  emojiButton: {
    padding: 4,
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    lineHeight: 20,
  },
  sendButton: {
    padding: 4,
    paddingBottom: 10,
  },
  attachmentMenu: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 16,
  },
  attachmentOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8e8e8",
    justifyContent: "center",
    alignItems: "center",
  },
});
