import { Conversation } from "@/src/types/chat.types";
import { useRef } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConversationRow({ item, onPress }: { item: Conversation, onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const preview = item.last_message_sender
    ? `${item.last_message_sender}: ${item.last_message ?? ""}`
    : (item.last_message ?? "");

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
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
            <Text style={styles.convoTime}>{item.last_message_time ?? ""}</Text>
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
    paddingTop: 4,
  },
  convoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
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
    marginRight: 8,
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