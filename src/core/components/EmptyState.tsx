/** Empty state placeholder component. */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Typography } from "@/src/core/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

/** Placeholder view with icon, title, and optional subtitle for empty lists. */
export default function EmptyState({ icon = "file-tray-outline", title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={Colors.text.secondary} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  title: { fontSize: Typography.sizes.lg, fontWeight: "600", color: Colors.text.primary, textAlign: "center" },
  subtitle: { fontSize: Typography.sizes.md, color: Colors.text.secondary, textAlign: "center" },
});
