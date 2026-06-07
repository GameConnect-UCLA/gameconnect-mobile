/** Reusable pressable button component. */
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Colors, Spacing, Radii, Typography } from "@/src/core/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

/** Pressable button with loading, disabled, and variant states. */
export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#fff" : Colors.primary} />
      ) : (
        <Text style={[styles.text, variant === "primary" ? styles.textPrimary : styles.textSecondary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radii.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: Colors.primary },
  ghost: { backgroundColor: "transparent" },
  disabled: { opacity: 0.5 },
  text: { fontSize: Typography.sizes.lg, fontWeight: "600" },
  textPrimary: { color: "#fff" },
  textSecondary: { color: Colors.primary },
});
