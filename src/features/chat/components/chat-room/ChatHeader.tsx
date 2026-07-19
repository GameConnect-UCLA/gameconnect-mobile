/** Chat room header with avatar, name, and action buttons */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from '@/src/core/theme';

interface ChatHeaderProps {
  displayName: string;
  avatarSource: ImageSourcePropType;
  onBack: () => void;
  onInfoPress: () => void;
  onMenuPress: () => void;
  onSearchPress?: () => void;
  insetsTop: number;
  isGroup?: boolean;
  memberCount?: number;
  onlineUsers?: string[];
  typingUsers?: string[];
  recipientId?: string;
}

/** Top bar showing chat avatar, name, back/search/overflow buttons */
export default function ChatHeader({
  displayName,
  avatarSource,
  onBack,
  onInfoPress,
  onMenuPress,
  onSearchPress,
  insetsTop,
  isGroup,
  memberCount,
  onlineUsers = [],
  typingUsers = [],
  recipientId,
}: ChatHeaderProps) {
  const isUserActive = !isGroup
    ? (onlineUsers.includes(recipientId ?? "") || typingUsers.includes(recipientId ?? ""))
    : typingUsers.length > 0;

  return (
    <View style={styles.header}>
      <View style={[styles.headerContent, { paddingTop: insetsTop + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={28} color={Colors.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} onPress={onInfoPress}>
          <Image source={avatarSource} style={styles.avatar} />
          <View style={styles.userTextInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={[styles.userStatus, isUserActive ? { color: "#037c2b", fontWeight: "600" } : null]}>
              {isGroup ? (
                typingUsers.length > 0 ? (
                  `${typingUsers.length} typing...`
                ) : (
                  `${memberCount ?? 1} members`
                )
              ) : (
                typingUsers.includes(recipientId ?? "") ? (
                  "typing..."
                ) : onlineUsers.includes(recipientId ?? "") ? (
                  "online"
                ) : (
                  "offline"
                )
              )}
            </Text>
          </View>
        </TouchableOpacity>

        {onSearchPress && (
          <TouchableOpacity style={styles.menuButton} onPress={onSearchPress}>
            <Ionicons name="search" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(210, 170, 120, 0.85)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: Spacing.xs,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userTextInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  userStatus: {
    fontSize: 12,
    color: "#555",
    marginTop: 1,
  },
  menuButton: {
    padding: Spacing.xs,
  },
});
