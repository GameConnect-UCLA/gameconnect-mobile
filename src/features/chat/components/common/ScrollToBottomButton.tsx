/** Floating button to scroll to bottom of message list */
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radii } from '@/src/core/theme';

interface ScrollToBottomButtonProps {
  visible: boolean;
  onPress: () => void;
  bottomOffset?: number;
}

/** Floating chevron button to jump to latest messages @param props.visible - Whether to show @param props.onPress - Scroll callback @param props.bottomOffset - Bottom inset offset */
export default function ScrollToBottomButton({
  visible,
  onPress,
  bottomOffset = 72,
}: ScrollToBottomButtonProps) {
  if (!visible) return null;

  return (
    <TouchableOpacity
      style={[styles.container, { bottom: bottomOffset }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    width: 48,
    height: 48,
    borderRadius: Radii.xl,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});