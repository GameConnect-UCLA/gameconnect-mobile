import { ActiveUser } from "@/src/types/chat.types";
import { useRef } from "react";
import { Animated, TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

export default function ActiveAvatar({ user }: { user: ActiveUser }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.activeAvatarWrapper}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.activeAvatarRing}>
          <Image source={user.avatar} style={styles.activeAvatarImg} />
        </View>
        <View style={styles.onlineDot} />
        <Text style={styles.activeAvatarName} numberOfLines={1}>
          {user.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const SAND_BG = "#d4b896";
const TEXT_PRIMARY = "#111";
const styles = StyleSheet.create({
  // Active users
  activeList: {
    gap: 20,
    paddingRight: 4,
  },
  activeAvatarWrapper: {
    alignItems: "center",
    width: 64,
  },
  activeAvatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.7)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  activeAvatarImg: {
    width: "100%",
    height: "100%",
  },
  onlineDot: {
    position: "absolute",
    bottom: 18,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2ecc71",
    borderWidth: 2,
    borderColor: SAND_BG,
  },
  activeAvatarName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
});