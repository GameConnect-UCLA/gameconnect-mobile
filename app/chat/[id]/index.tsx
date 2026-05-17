import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useConversation } from "@/src/hooks/chat/useConversation";
import ChatHeader from "@/src/components/chat/chat-header";
import ChatMessageBubble from "@/src/components/chat/chat-message-bubble";
import ChatInput from "@/src/components/chat/chat-input";
import ChatOverflowMenu from "@/src/components/chat/ChatOverflowMenu";
import { Alert } from "react-native";

const BG = require("@/assets/images/bgbody.png");
const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

export default function ChatDirectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: conversation, isLoading, error } = useConversation(id);
  const [menuVisible, setMenuVisible] = useState(false);

  const contact = conversation?.members?.[0];
  const displayName = conversation?.name ?? contact?.username ?? "Unknown";
  const avatarSource = contact?.profile_pic
    ? { uri: contact.profile_pic }
    : DEFAULT_AVATAR;

  const currentUserId = "current_user";
  const messages = conversation?.messages ?? [];

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

        <ChatHeader
          displayName={displayName}
          avatarSource={avatarSource}
          onBack={() => router.back()}
          onInfoPress={navigateToInfo}
          onMenuPress={() => setMenuVisible(true)}
          insetsTop={insets.top}
        />
        <ScrollView>
          <KeyboardStickyView offset={{ closed: -insets.bottom + 15 }}>
            <ScrollView contentContainerStyle={styles.messagesScrollContent}>
              <View style={styles.messagesArea}>
                {messages.map((msg) => (
                  <ChatMessageBubble
                    key={msg.id}
                    message={msg}
                    isOwnMessage={msg.sent_by === currentUserId}
                  />
                ))}
              </View>
            </ScrollView>
          </KeyboardStickyView>
        </ScrollView>

        <KeyboardStickyView
          enabled
          offset={{ closed: -insets.bottom, opened: -insets.bottom / 3 }}
        >
          <ChatInput onSend={() => {}} />
        </KeyboardStickyView>

        <ChatOverflowMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
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
  messagesScrollContent: {},
  messagesArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
});
