/** Loading spinner with optional message. */
import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { Colors, Spacing, Typography } from "@/src/core/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  message?: string;
}

/** Centered ActivityIndicator with optional message text. */
export default function LoadingSpinner({
  size = "large",
  color = Colors.primary,
  message,
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  message: { fontSize: Typography.sizes.md, color: Colors.text.secondary },
});
