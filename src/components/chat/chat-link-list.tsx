import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SharedLinkItem } from "@/src/types/chat.types";

interface ChatLinkListProps {
  items: SharedLinkItem[];
}

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
            <Ionicons name="link-outline" size={22} color="#033563" />
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
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.2)",
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(3, 53, 99, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  linkUrl: {
    fontSize: 12,
    color: "#033563",
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#8e8e93",
  },
});
