/** Mention (`@`) autocomplete dropdown for group chats */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import type { GroupMember } from '../../types/chat.types';
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme';

interface MentionSuggestionsProps {
  visible: boolean;
  members: GroupMember[];
  query: string;
  onSelect: (member: GroupMember) => void;
  position: { top: number; left: number };
}

/** Filtered member list dropdown for mention (`@`) autocomplete */
export default function MentionSuggestions({
  visible,
  members,
  query,
  onSelect,
  position,
}: MentionSuggestionsProps) {
  if (!visible) return null;

  const filtered = query
    ? members.filter((m) =>
        m.username?.toLowerCase().includes(query.toLowerCase()),
      )
    : members;

  if (filtered.length === 0) return null;

  return (
    <View style={[styles.container, { top: position.top, left: position.left }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => onSelect(item)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(item.username?.[0] ?? "?").toUpperCase()}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.username}>@{item.username ?? "unknown"}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 12,
    maxHeight: 200,
    width: 240,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: Radii.md,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  role: {
    fontSize: Typography.sizes.xs,
    color: "#888",
    marginTop: 1,
  },
});
