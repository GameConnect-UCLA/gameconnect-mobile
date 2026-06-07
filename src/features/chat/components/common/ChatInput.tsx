/** Chat text input with attachments, mentions, game cards */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import type { Attachment, GroupMember, GameInfoCard } from '../../types/chat.types'
import { AttachmentType } from '../../types/chat.types'
import MediaPreview from './MediaPreview'
import MentionSuggestions from './MentionSuggestions'
import GameSearchModal from './GameSearchModal'
import { useAutocomplete } from '../../hooks/useAutocomplete'
import { useToastStore } from "@/src/core/store/toast.store";

const MAX_INPUT_HEIGHT = 120;
const BASE_LINE_HEIGHT = 40;
const MAX_ATTACHMENTS = 5;

interface ChatInputProps {
  onSend: (
    text: string | null,
    attachments?: Attachment[] | null,
    replyToId?: string | null,
    gameCard?: GameInfoCard | null,
  ) => void;
  onHeightChange?: (height: number) => void;
  recipientName?: string;
  blocked?: boolean;
  groupMembers?: GroupMember[] | null;
}

/** Message composer with text input, attachment menu, and @-mention support @param props.onSend - Send callback @param props.onHeightChange - Input height change callback @param props.recipientName - Chat recipient name @param props.blocked - Whether user is blocked @param props.groupMembers - Group members for mentions */
export default function ChatInput({
  onSend,
  onHeightChange,
  recipientName,
  blocked = false,
  groupMembers,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(BASE_LINE_HEIGHT);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const messageRef = useRef(message);
  messageRef.current = message;
  const showToast = useToastStore((s) => s.showToast);

  const isGroup = !!groupMembers;
  const {
    mentionQuery,
    mentionVisible,
    selection,
    detectAutocomplete,
    handleMentionSelect: onMentionSelect,
    handleSelectionChange,
  } = useAutocomplete(isGroup);

  useEffect(() => {
    if (message === "" && attachments.length === 0) {
      setInputHeight(BASE_LINE_HEIGHT);
      onHeightChange?.(BASE_LINE_HEIGHT + 16);
    }
  }, [message, attachments.length, onHeightChange]);

  const handleChangeText = useCallback(
    (text: string) => {
      const prevLen = messageRef.current.length;
      setMessage(text);
      messageRef.current = text;
      const cursorPos = selection.start + (text.length - prevLen);
      detectAutocomplete(text, Math.max(0, cursorPos));
    },
    [detectAutocomplete, selection.start],
  );

  const handleMentionSelect = useCallback(
    (member: GroupMember) => {
      onMentionSelect(member, message, setMessage);
    },
    [onMentionSelect, message],
  );

  const handleGameModalSelect = useCallback(
    (game: GameInfoCard) => {
      onSend(null, null, undefined, game);
      setShowAttachmentMenu(false);
    },
    [onSend],
  );

  const handleSend = () => {
    const text = message.trim() || null;
    const hasAttachments = attachments.length > 0;
    if (!text && !hasAttachments) return;

    onSend(text, hasAttachments ? attachments : null, undefined, null);
    setMessage("");
    setAttachments([]);
    setShowAttachmentMenu(false);
  };

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const newHeight = Math.min(
        Math.max(event.nativeEvent.contentSize.height, BASE_LINE_HEIGHT),
        MAX_INPUT_HEIGHT,
      );
      setInputHeight(newHeight);
      onHeightChange?.(newHeight + 16);
    },
    [onHeightChange],
  );

  const pickImage = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      showToast(`Maximum ${MAX_ATTACHMENTS} attachments allowed.`, "warning");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newAttachment: Attachment = {
        url: asset.uri,
        type: AttachmentType.IMAGE,
        width: asset.width ?? 0,
        height: asset.height ?? 0,
      };
      setAttachments((prev) => [...prev, newAttachment]);
    }
    setShowAttachmentMenu(false);
  };

  const pickGame = useCallback(() => {
    setShowAttachmentMenu(false);
    setGameModalVisible(true);
  }, []);

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;
  const dropdownTop = -(inputHeight + 32);

  return (
    <View>
      {blocked && (
        <View style={styles.blockedBanner}>
          <Ionicons name="remove-circle-outline" size={16} color="#B42318" />
          <Text style={styles.blockedBannerText}>
            You have blocked this contact. Unblock to send messages.
          </Text>
        </View>
      )}

      {!blocked && attachments.length > 0 && (
        <MediaPreview attachments={attachments} onRemove={removeAttachment} />
      )}

      {!blocked && showAttachmentMenu && (
        <View style={styles.attachmentMenu}>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#033563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickGame}>
            <Ionicons name="game-controller" size={24} color="#033563" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputWrapper}>
        <MentionSuggestions
          visible={mentionVisible}
          members={groupMembers ?? []}
          query={mentionQuery}
          onSelect={handleMentionSelect}
          position={{ top: dropdownTop, left: 12 }}
        />

        <View style={styles.inputContainer}>
          {!blocked && (
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
          )}

          <TextInput
            style={[styles.textInput, { height: inputHeight }]}
            placeholder={blocked ? "You have blocked this contact" : "Message"}
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={handleChangeText}
            onSelectionChange={handleSelectionChange}
            multiline
            textAlignVertical="top"
            onContentSizeChange={handleContentSizeChange}
            maxLength={2000}
            editable={!blocked}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!canSend}
          >
            <Ionicons
              name={canSend ? "send" : "mic-outline"}
              size={26}
              color={canSend ? "#033563" : "#888"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <GameSearchModal
        visible={gameModalVisible}
        onSelect={handleGameModalSelect}
        onClose={() => setGameModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blockedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    marginHorizontal: 12,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  blockedBannerText: {
    fontSize: 13,
    color: "#B42318",
    flex: 1,
  },
  inputWrapper: {
    position: "relative",
  },
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
