/** Grid of shared media items in chat info screen */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { SharedMediaItem } from '../../types/chat.types';
import { Colors, Typography } from '@/src/core/theme';

interface ChatMediaGridProps {
  items: SharedMediaItem[];
}

/** Display shared media items in a 3-column grid @param props.items - Array of shared media */
export default function ChatMediaGrid({ items }: ChatMediaGridProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay multimedia compartida</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={styles.gridItem}>
          <Image source={{ uri: item.url }} style={styles.thumbnail} />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 2,
  },
  gridItem: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 2,
    justifyContent: "flex-end",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: Typography.sizes.xs,
    color: "#fff",
    fontWeight: "500",
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
