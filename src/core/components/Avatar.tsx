/** User avatar component with fallback icon. */
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AvatarProps {
  uri?: string | null;
  size?: number;
  fallback?: string;
}

/** Circular avatar showing image or Ionicons fallback. */
export default function Avatar({ uri, size = 48, fallback = "person-outline" }: AvatarProps) {
  const iconSize = size * 0.5;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name={fallback as any} size={iconSize} color="#999" />
    </View>
  );
}

const styles = StyleSheet.create({
  image: { resizeMode: "cover" },
  fallback: {
    backgroundColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});
