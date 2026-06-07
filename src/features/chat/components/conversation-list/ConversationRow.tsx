/** Single conversation row in the chat list */
import { Conversation } from '../../types/chat.types';
import { useRef } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Spacing } from '@/src/core/theme';
import { strings } from '@/src/core/i18n/es';

function formatTime(isoString?: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneDay = 86400000;

  if (diff < oneDay && now.getDate() === date.getDate()) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
    return strings.chat.time.yesterday;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Conversation row with avatar, name, preview, and time, with spring press animation @param props.item - Conversation data @param props.onPress - Tap handler @param props.onLongPress - Long-press handler */
export default function ConversationRow({ item, onPress, onLongPress }: { item: Conversation, onPress: () => void, onLongPress?: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const senderName = item.last_message_sender === "current_user"
    ? "You"
    : item.last_message_sender;
  const preview = item.is_group && senderName
    ? `${senderName}: ${item.last_message ?? ""}`
    : (item.last_message ?? "");

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Animated.View style={[styles.convoRow, { transform: [{ scale }] }]}>
        <View style={styles.avatarContainer}>
          <Image 
            source={item.group_picture ? { uri: item.group_picture } : require("@/assets/images/default-avatar.jpg")} 
            style={styles.convoAvatar} 
          />
        </View>

        <View style={styles.convoContent}>
          <View style={styles.convoHeader}>
            <Text style={styles.convoName} numberOfLines={1}>
              {item.name ?? "Unnamed Chat"}
            </Text>
            <Text style={styles.convoTime}>{formatTime(item.last_message_time)}</Text>
          </View>

          {item.is_group && item.member_count && (
            <Text style={styles.memberCount}>{item.member_count} miembros</Text>
          )}

          <Text style={styles.convoPreview} numberOfLines={1}>
            {preview}
          </Text>
        </View>
      </Animated.View>
      <View style={styles.divider} />
    </TouchableOpacity>
  );
}


const TEXT_PRIMARY = "#111";
const ACCENT = "#6c5ce7";
const DIVIDER = "rgba(0,0,0,0.08)";

const styles = StyleSheet.create({

      // Divider
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginHorizontal: 0,
  },

    // Conversations
  convoList: {
    paddingTop: Spacing.xs,
  },
  convoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  avatarContainer: {
    marginRight: 14,
  },
  convoAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#ccc",
  },
  convoContent: {
    flex: 1,
  },
  convoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  convoName: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    flex: 1,
    marginRight: Spacing.sm,
  },
  convoTime: {
    fontSize: 12,
    color: "111",
    flexShrink: 0,
  },
  memberCount: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: "600",
    marginBottom: 2,
  },
  convoPreview: {
    fontSize: 13.5,
    color: TEXT_PRIMARY   ,
    marginTop: 1,
  },

})