import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
}

interface ChatOverflowMenuProps {
  visible: boolean;
  onClose: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: "notifications-off-outline", label: "Mute Notifications" },
  { icon: "search-outline", label: "Search Chat" },
  { icon: "trash-outline", label: "Clear Chat History" },
  { icon: "ban-outline", label: "Block User", danger: true },
  { icon: "flag-outline", label: "Report", danger: true },
];

export default function ChatOverflowMenu({
  visible,
  onClose,
}: ChatOverflowMenuProps) {
  const insets = useSafeAreaInsets();

  const handlePress = (label: string) => {
    Alert.alert(label, "This feature is coming soon.");
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
    paddingRight: 12,
    alignItems: "flex-end",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  menuItemText: {
    fontSize: 15,
    color: "#1a1a1a",
    marginLeft: 12,
  },
  menuItemDanger: {
    color: "#d32f2f",
  },
});
