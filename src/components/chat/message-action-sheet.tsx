import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MessageActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onReply: () => void;
  onDelete: () => void;
  isOwnMessage: boolean;
}

export default function MessageActionSheet({
  visible,
  onClose,
  onReply,
  onDelete,
  isOwnMessage,
}: MessageActionSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 220,
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
