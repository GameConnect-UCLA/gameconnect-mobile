/** Game info card embed rendered inside a message bubble */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import type { GameInfoCard as GameInfoCardType } from '../../types/chat.types';
import { Colors, Spacing, Typography } from '@/src/core/theme';

interface GameInfoCardProps {
  game: GameInfoCardType;
  maxWidth: number;
  onPress: () => void;
}

/** Display a game card with cover, title, developer, rating, and tags @param props.game - Game info data @param props.maxWidth - Maximum card width @param props.onPress - Tap handler */
export default function GameInfoCard({
  game,
  maxWidth,
  onPress,
}: GameInfoCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { maxWidth }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: game.cover_url }} style={styles.cover} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={styles.developer} numberOfLines={1}>
          {game.developer}
        </Text>
        <View style={styles.tagsRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{game.rating_score}</Text>
          </View>
          {game.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
  },
  cover: {
    width: "100%",
    height: 120,
    backgroundColor: "#ddd",
  },
  body: {
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  developer: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: 6,
    alignItems: "center",
  },
  ratingBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: "#fff",
    fontSize: Typography.sizes.xs,
    fontWeight: "600",
  },
  tag: {
    backgroundColor: "rgba(3, 53, 99, 0.12)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    color: Colors.primary,
    fontSize: Typography.sizes.xs,
  },
});
