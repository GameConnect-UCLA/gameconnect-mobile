/** Long-press action sheet for messages (reply / delete) */
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from '@/src/core/theme';
import { strings } from '@/src/core/i18n/es';

const SHEET_WIDTH = 220;
const SHEET_MARGIN = 12;
const ITEM_HEIGHT = 52;

interface MessageActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onReply: () => void;
  onDelete: () => void;
  isOwnMessage: boolean;
  pageY: number;
}

/** Positioned action sheet with Reply and Delete options @param props.visible - Modal visibility @param props.onClose - Close handler @param props.onReply - Reply action @param props.onDelete - Delete action @param props.isOwnMessage - Show delete for own messages @param props.pageY - Vertical position for placement */
export default function MessageActionSheet({
  visible,
  onClose,
  onReply,
  onDelete,
  isOwnMessage,
  pageY,
}: MessageActionSheetProps) {
  const { height: screenHeight } = useWindowDimensions();

  const itemCount = isOwnMessage ? 2 : 1;
  const sheetHeight = itemCount * ITEM_HEIGHT + 16;

  const top = useMemo(() => {
    const center = pageY - sheetHeight / 2;
    return Math.max(SHEET_MARGIN, Math.min(center, screenHeight - sheetHeight - SHEET_MARGIN));
  }, [pageY, sheetHeight, screenHeight]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, { top }]}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onReply();
              onClose();
            }}
          >
            <Ionicons name="arrow-undo" size={22} color={Colors.text.primary} />
            <Text style={styles.optionText}>{strings.chat.actions.reply}</Text>
          </TouchableOpacity>

          {isOwnMessage && (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onDelete();
                onClose();
              }}
            >
              <Ionicons name="trash-outline" size={22} color={Colors.status.error} />
              <Text style={[styles.optionText, styles.deleteText]}>
                {strings.chat.actions.deleteForEveryone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    minWidth: SHEET_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: Spacing.md,
  },
  optionText: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  },
  deleteText: {
    color: Colors.status.error,
  },
});
