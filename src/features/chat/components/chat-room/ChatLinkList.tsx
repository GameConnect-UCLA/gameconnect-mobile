/** List of shared links in chat info screen */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SharedLinkItem } from '../../types/chat.types';
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme';

interface ChatLinkListProps {
  items: SharedLinkItem[];
}

/** Display shared links with title and URL @param props.items - Array of shared links */
export default function ChatLinkList({ items }: ChatLinkListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay enlaces compartidos</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {items.map((link) => (
        <View key={link.id} style={styles.linkRow}>
          <View style={styles.linkIcon}>
            <Ionicons name="link-outline" size={22} color={Colors.primary} />
          </View>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle} numberOfLines={1}>
              {link.title}
            </Text>
            <Text style={styles.linkUrl} numberOfLines={1}>
              {link.url}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.2)",
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: "rgba(3, 53, 99, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  linkUrl: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
  },
});
