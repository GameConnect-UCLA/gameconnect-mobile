import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Conversation, GroupMember } from "@/src/types/chat.types";
import { GroupRole } from "@/src/types/chat.types";
import { getCurrentUserId } from "@/src/api/chat.api";

interface ConversationActionsSheetProps {
  visible: boolean;
  conversation: Conversation | null;
  onClose: () => void;
  onOpenChat: () => void;
  onMute: () => void;
  onReport: () => void;
  onDelete: () => void;
}

function isOwner(conversation: Conversation): boolean {
  const currentUserId = getCurrentUserId();
  return conversation.members?.some(
    (m: GroupMember) => m.user_id === currentUserId && m.role === GroupRole.OWNER,
  ) ?? false;
}

export default function ConversationActionsSheet({
  visible,
  conversation,
  onClose,
  onOpenChat,
  onMute,
  onReport,
  onDelete,
}: ConversationActionsSheetProps) {
  if (!conversation) return null;

  const group = conversation.is_group;
  const owner = group && isOwner(conversation);
  const deleteLabel = group ? (owner ? "Delete Group" : "Leave Group") : "Delete Chat";

  const menuItems: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; danger?: boolean }[] = [
    { icon: "chatbubble-outline", label: "Open Chat", onPress: onOpenChat },
    { icon: "notifications-off-outline", label: "Mute Notifications", onPress: onMute },
    { icon: "flag-outline", label: "Report", onPress: onReport, danger: true },
    { icon: group && owner ? "trash-outline" : "exit-outline", label: deleteLabel, onPress: onDelete, danger: true },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.handle} />
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? "#d32f2f" : "#1a1a1a"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  item.danger && styles.menuItemDanger,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 34,
    paddingHorizontal: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignSelf: "center",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  menuItemText: {
    fontSize: 16,
    color: "#1a1a1a",
    marginLeft: 14,
  },
  menuItemDanger: {
    color: "#d32f2f",
  },
});
