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
            <Ionicons name="arrow-undo" size={22} color="#1a1a1a" />
            <Text style={styles.optionText}>Reply</Text>
          </TouchableOpacity>

          {isOwnMessage && (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onDelete();
                onClose();
              }}
            >
              <Ionicons name="trash-outline" size={22} color="#d32f2f" />
              <Text style={[styles.optionText, styles.deleteText]}>
                Delete for Everyone
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
    paddingVertical: 8,
    paddingHorizontal: 4,
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
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  deleteText: {
    color: "#d32f2f",
  },
});
