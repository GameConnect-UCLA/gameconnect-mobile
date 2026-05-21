import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatHeaderProps {
  displayName: string;
  avatarSource: ImageSourcePropType;
  onBack: () => void;
  onInfoPress: () => void;
  onMenuPress: () => void;
  onSearchPress?: () => void;
  insetsTop: number;
}

export default function ChatHeader({
  displayName,
  avatarSource,
  onBack,
  onInfoPress,
  onMenuPress,
  onSearchPress,
  insetsTop,
}: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={[styles.headerContent, { paddingTop: insetsTop + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} onPress={onInfoPress}>
          <Image source={avatarSource} style={styles.avatar} />
          <View style={styles.userTextInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userStatus}>last seen recently</Text>
          </View>
        </TouchableOpacity>

        {onSearchPress && (
          <TouchableOpacity style={styles.menuButton} onPress={onSearchPress}>
            <Ionicons name="search" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Ionicons name="ellipsis-vertical" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(210, 170, 120, 0.85)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userTextInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  userStatus: {
    fontSize: 12,
    color: "#555",
    marginTop: 1,
  },
  menuButton: {
    padding: 4,
  },
});
