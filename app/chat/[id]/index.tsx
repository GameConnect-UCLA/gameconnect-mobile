import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardStickyView,
  KeyboardChatScrollView,
} from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";
import { useConversation } from "@/src/hooks/chat/useConversation";
import type { Attachment } from "@/src/types/chat.types";
import ChatHeader from "@/src/components/chat/chat-header";
import ChatMessageBubble from "@/src/components/chat/chat-message-bubble";
import ChatInput from "@/src/components/chat/chat-input";
import ChatOverflowMenu from "@/src/components/chat/ChatOverflowMenu";
import ScrollToBottomButton from "@/src/components/chat/scroll-to-bottom-button";
import { useScrollToBottom } from "@/src/hooks/chat/use-scroll-to-bottom";

const BG = require("@/assets/images/bgbody.png");
const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

const INPUT_CONTAINER_BASE_HEIGHT = 56;
const INPUT_MAX_HEIGHT = 144;

export default function ChatDirectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    data: conversation,
    messages,
    isLoading,
    error,
    sendMessage,
  } = useConversation(id);
  const [menuVisible, setMenuVisible] = useState(false);
  const { scrollViewRef, showButton, scrollToBottom, handleScroll } =
    useScrollToBottom();

  const composerHeight = useSharedValue(INPUT_CONTAINER_BASE_HEIGHT);

  const contact = conversation?.members?.[0];
  const isGroupChat = conversation?.is_group ?? false;
  const displayName = conversation?.name ?? contact?.username ?? "Unknown";
  const avatarSource = isGroupChat
    ? (conversation?.group_picture ? { uri: conversation.group_picture } : DEFAULT_AVATAR)
    : (contact?.profile_pic ? { uri: contact.profile_pic } : DEFAULT_AVATAR);

  const currentUserId = "current_user";

  const navigateToInfo = () => {
    router.push(`/chat/${id}/info`);
  };

  const handleHeightChange = useCallback(
    (height: number) => {
      composerHeight.value = Math.min(
        Math.max(height + 24, INPUT_CONTAINER_BASE_HEIGHT),
        INPUT_MAX_HEIGHT,
      );
    },
    [composerHeight],
  );

  const handleSend = useCallback(
    async (text: string | null, attachments?: Attachment[] | null) => {
      scrollToBottom();
      if (!id) return;
      try {
        await sendMessage(text, attachments);
      } catch (err) {
        console.error("Error en flujo de envío:", err);
      }
    },
    [id, sendMessage, scrollToBottom],
  );

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

        <KeyboardChatScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.messagesArea,
            { paddingBottom: insets.bottom },
          ]}
        >
          {messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.sent_by === currentUserId}
            />
          ))}
        </KeyboardChatScrollView>

        <KeyboardStickyView
          offset={{ closed: -insets.bottom, opened: -insets.bottom / 3 }}
        >
          <ScrollToBottomButton
            visible={showButton}
            onPress={scrollToBottom}
            bottomOffset={80}
          />
          <ChatInput onSend={handleSend} onHeightChange={handleHeightChange} recipientName={displayName} />
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

  messagesArea: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
});
