import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useConversation } from "@/src/hooks/chat/useConversation";

const BG = require("@/assets/images/bgbody.png");
const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

export default function ChatDirectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: conversation, isLoading, error } = useConversation(id);
  const [message, setMessage] = useState("");

  const contact = conversation?.members?.[0];
  const displayName = conversation?.name ?? contact?.username ?? "Unknown";
  const avatarSource = contact?.profile_pic
    ? { uri: contact.profile_pic }
    : DEFAULT_AVATAR;

  const navigateToInfo = () => {
    router.push(`/chat/${id}/info`);
  };

  if (isLoading) {
    return (
      <ImageBackground source={BG} style={styles.background}>
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#033563" />
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={BG} style={styles.background}>
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading conversation</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.background}>
      <View style={[styles.container]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header - extends behind status bar */}
        <View style={styles.header}>
          <View style={[styles.headerContent, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.userInfo} onPress={navigateToInfo}>
              <Image source={avatarSource} style={styles.avatar} />
              <View style={styles.userTextInfo}>
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userStatus}>last seen recently</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAwareScrollView bottomOffset={insets.bottom}>
          {/* Área de mensajes */}
          <View style={styles.messagesArea} />
        </KeyboardAwareScrollView>

        <KeyboardStickyView
          offset={{ closed: -insets.bottom, opened: -insets.bottom / 3 }}
        >
          {/* Input de mensaje */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={26} color="#888" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Message"
              placeholderTextColor="#aaa"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic-outline" size={26} color="#888" />
            </TouchableOpacity>
          </View>
        </KeyboardStickyView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
  },
  // --- Header ---
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
  // --- Área de mensajes ---
  messagesArea: {
    flex: 1,
  },
  // --- Input ---
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: "#e8e8e8",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emojiButton: {
    padding: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  micButton: {
    padding: 4,
  },
});
