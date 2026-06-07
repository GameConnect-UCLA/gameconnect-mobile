/** Three-dot overflow menu for chat room options */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing } from '@/src/core/theme';
import { useConfirmDialog } from "@/src/core/hooks/useConfirmDialog";
import { useToastStore } from "@/src/core/store/toast.store";
import { strings } from '@/src/core/i18n/es';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
}

interface ChatOverflowMenuProps {
  visible: boolean;
  onClose: () => void;
  isGroup?: boolean;
  onLeaveGroup?: () => void;
}

/** Overflow menu with mute, search, clear, leave/block, and report options @param props.visible - Menu visibility @param props.onClose - Close handler @param props.isGroup - Group chat flag @param props.onLeaveGroup - Leave group handler */
export default function ChatOverflowMenu({
  visible,
  onClose,
  isGroup,
  onLeaveGroup,
}: ChatOverflowMenuProps) {
  const { confirm } = useConfirmDialog();
  const showToast = useToastStore((s) => s.showToast);
  const MENU_ITEMS: MenuItem[] = [
    { icon: "notifications-off-outline", label: strings.chat.actions.muteNotifications },
    { icon: "search-outline", label: strings.chat.actions.searchChat },
    { icon: "trash-outline", label: strings.chat.actions.clearChat },
    ...(isGroup
      ? [{ icon: "exit-outline" as const, label: strings.chat.actions.leaveGroup, danger: true }]
      : [{ icon: "ban-outline" as const, label: strings.chat.actions.blockUser, danger: true }]
    ),
    { icon: "flag-outline", label: strings.chat.actions.report, danger: true },
  ];
  const insets = useSafeAreaInsets();

  const handlePress = async (label: string) => {
    if (label === strings.chat.actions.leaveGroup) {
      const ok = await confirm({
        title: strings.chat.actions.leaveGroupConfirmTitle,
        message: strings.chat.actions.leaveGroupConfirmMessage,
        confirmText: strings.chat.actions.leaveConfirm,
      });
      if (ok) {
        onLeaveGroup?.();
        onClose();
      }
      return;
    }
    showToast(`${label}: coming soon.`, "info");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.menuContainer,
            { paddingTop: insets.top + 56 },
          ]}
        >
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handlePress(item.label)}
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
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menuContainer: {
    paddingRight: Spacing.md,
    alignItems: "flex-end",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    minWidth: 200,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  menuItemText: {
    fontSize: 15,
    color: Colors.text.primary,
    marginLeft: Spacing.md,
  },
  menuItemDanger: {
    color: Colors.status.error,
  },
});
