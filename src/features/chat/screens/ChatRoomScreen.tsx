/** Chat room screen with messages, input, search, and overlay menus */
import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams,  } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardStickyView,
  KeyboardChatScrollView,
} from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";
import { useQueryClient } from "@tanstack/react-query";
import { useConversation } from '../hooks/useConversation';
import { useGroupMembers } from '../hooks/useGroupMembers';
import { useChatStore } from '../store/chat.store';
import { useUserStore } from '@/src/core/store/user.store';
import type { Attachment, GameInfoCard, Message } from '../types/chat.types';
import { deleteMessage } from '../api/chat.api';
import { useToastStore } from '@/src/core/store/toast.store';
import ChatHeader from '../components/chat-room/ChatHeader';
import ChatSearchBar from '../components/conversation-list/ChatSearchBar';
import ChatMessageBubble from '../components/common/MessageBubble';
import ChatInput from '../components/common/ChatInput';
import ChatOverflowMenu from '../components/common/ChatOverflowMenu';
import MessageActionSheet from '../components/chat-room/MessageActionSheet';
import ReplyBar from '../components/common/ReplyBar';
import ScrollToBottomButton from '../components/common/ScrollToBottomButton';
import { useScrollToBottom } from '../hooks/useScrollToBottom';
import { useChatSocket } from '../hooks/useChatSocket';
import { useNavigation } from '@/src/core/hooks/useNavigation';

const BG = require("@/assets/images/bgbody.png");
const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

const INPUT_CONTAINER_BASE_HEIGHT = 56;
const INPUT_MAX_HEIGHT = 144;

/** Full chat room: message list, input bar, search, overflow menu, and action sheet */
export default function ChatDirectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const {
    data: conversation,
    messages,
    isLoading,
    error,
  } = useConversation(id);
  const socket = useChatSocket(id);
  const { push, back } = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuMessage, setMenuMessage] = useState<Message | null>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetPageY, setActionSheetPageY] = useState(0);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const {
    scrollViewRef,
    showButton,
    scrollToBottom,
    handleScroll,
    handleContentSizeChange,
  } = useScrollToBottom();

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [isLoading, messages.length, scrollToBottom]);
  const { leaveGroup } = useGroupMembers(id);
  const showToast = useToastStore((s) => s.showToast);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const messageLayouts = useRef<Map<string, number>>(new Map());

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lower = searchQuery.toLowerCase();
    const indices: number[] = [];
    messages.forEach((msg, i) => {
      if (msg.messageText?.toLowerCase().includes(lower)) {
        indices.push(i);
      }
    });
    return indices;
  }, [messages, searchQuery]);

  const scrollToMessage = useCallback(
    (messageIndex: number) => {
      const msg = messages[messageIndex];
      if (!msg) return;
      const y = messageLayouts.current.get(msg.id);
      if (y !== undefined) {
        scrollViewRef.current?.scrollTo({ y, animated: true });
      }
    },
    [messages, scrollViewRef],
  );

  const openSearch = useCallback(() => {
    setSearchVisible(true);
    setSearchQuery("");
    setActiveSearchIndex(0);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchVisible(false);
    setSearchQuery("");
    setActiveSearchIndex(0);
    Keyboard.dismiss();
  }, []);

  const handleSearchNext = useCallback(() => {
    setActiveSearchIndex((prev) => {
      const next = Math.min(prev + 1, searchResults.length - 1);
      scrollToMessage(searchResults[next]);
      return next;
    });
  }, [searchResults, scrollToMessage]);

  const handleSearchPrev = useCallback(() => {
    setActiveSearchIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      scrollToMessage(searchResults[next]);
      return next;
    });
  }, [searchResults, scrollToMessage]);

  const handleMessageLayout = useCallback(
    (messageId: string, y: number) => {
      messageLayouts.current.set(messageId, y);
    },
    [],
  );

  const composerHeight = useSharedValue(INPUT_CONTAINER_BASE_HEIGHT);

  const senderMap = useMemo(() => {
    if (!conversation?.members) return new Map<string, { name: string; avatar: string | null }>();
    const map = new Map<string, { name: string; avatar: string | null }>();
    for (const m of conversation.members) {
      map.set(m.userId, { name: m.username ?? "Unknown", avatar: m.profilePic ?? null });
    }
    return map;
  }, [conversation?.members]);

  const currentUserId = useUserStore((s) => s.user?.id ?? "currentUser");
  const contact = conversation?.members?.find((m) => m.userId !== currentUserId);
  const isGroupChat = conversation?.isGroup ?? false;
  const displayName = conversation?.name ?? contact?.username ?? "Unknown";
  const avatarSource = isGroupChat
    ? (conversation?.groupPicture ? { uri: conversation.groupPicture } : DEFAULT_AVATAR)
    : (contact?.profilePic ? { uri: contact.profilePic } : DEFAULT_AVATAR);

  const blockedUserIds = useChatStore((s) => s.blockedUserIds);
  const isBlocked = !isGroupChat && contact?.userId
    ? blockedUserIds.includes(contact.userId)
    : false;

  const navigateToInfo = () => {
    push(`/chat/${id}/info`);
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
    (
      text: string | null,
      attachments?: Attachment[] | null,
      _replyToId?: string | null,
      gameCard?: GameInfoCard | null,
    ) => {
      scrollToBottom();
      if (!id) return;
      socket.sendMessage(text, attachments, replyingTo?.id ?? null, gameCard);
      setReplyingTo(null);
    },
    [id, socket, scrollToBottom, replyingTo],
  );

  const handleMentionPress = useCallback(
    (username: string) => {
      const member = conversation?.members?.find(
        (m) => m.username === username,
      );
      if (member?.userId) {
        push(`/user/${member.userId}`);
      }
    },
    [conversation?.members, push],
  );

  const handleGameCardPress = useCallback(
    (gameId: string) => {
      push(`/game/${gameId}`);
    },
    [push],
  );

  const handleLongPress = useCallback((msg: Message, pageY: number) => {
    Keyboard.dismiss();
    setMenuMessage(msg);
    setActionSheetPageY(pageY);
    setActionSheetVisible(true);
  }, []);

  const handleSwipeToReply = useCallback((msg: Message) => {
    setReplyingTo(msg);
  }, []);

  const handleDeleteMessage = useCallback(async () => {
    if (!menuMessage || !id) return;
    try {
      await deleteMessage(id, menuMessage.id);
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    } catch (err) {
      console.error("Error deleting message:", err);
    }
    setMenuMessage(null);
  }, [menuMessage, id, queryClient]);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleLeaveGroup = useCallback(async () => {
    if (!id) return;
    try {
      await leaveGroup();
      useChatStore.getState().hideConversation(id);
      back();
    } catch {
      showToast("Failed to leave group.", "error");
    }
  }, [id, leaveGroup, back, showToast]);

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

        <View>
          <ChatHeader
            displayName={displayName}
            avatarSource={avatarSource}
            onBack={() => back()}
            onInfoPress={navigateToInfo}
            onMenuPress={() => setMenuVisible(true)}
            onSearchPress={searchVisible ? closeSearch : openSearch}
            insetsTop={insets.top}
            isGroup={isGroupChat}
            memberCount={conversation?.memberCount}
            onlineUsers={socket.onlineUsers}
            typingUsers={socket.typingUsers}
            recipientId={contact?.userId}
          />

          <ChatSearchBar
            visible={searchVisible}
            query={searchQuery}
            onChangeQuery={setSearchQuery}
            onClose={closeSearch}
            onNext={handleSearchNext}
            onPrev={handleSearchPrev}
            totalResults={searchResults.length}
            currentIndex={
              searchResults.length > 0 ? activeSearchIndex : 0
            }
            insetsTop={insets.top}
          />
        </View>

        {messages.length === 0 ? (
          <View style={styles.emptyRoom}>
            <Ionicons name="chatbubble-ellipses-outline" size={48} color="#999" />
            <Text style={styles.emptyRoomText}>
              Send a message to start your conversation with {displayName}
            </Text>
          </View>
        ) : (
          <KeyboardChatScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={handleContentSizeChange}
            contentContainerStyle={[
              styles.messagesArea,
              { paddingBottom: insets.bottom },
            ]}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                onLayout={(e) =>
                  handleMessageLayout(msg.id, e.nativeEvent.layout.y)
                }
              >
                <ChatMessageBubble
                  message={msg}
                  isOwnMessage={msg.sentBy === currentUserId}
                  onLongPress={handleLongPress}
                  onSwipeToReply={handleSwipeToReply}
                  highlightText={searchVisible ? searchQuery : null}
                  isGroup={isGroupChat}
                  senderName={senderMap.get(msg.sentBy)?.name ?? msg.senderUsername}
                  senderAvatar={senderMap.get(msg.sentBy)?.avatar ?? msg.senderProfilePic}
                  onMentionPress={handleMentionPress}
                  onGameCardPress={handleGameCardPress}
                />
              </View>
            ))}
          </KeyboardChatScrollView>
        )}

        <KeyboardStickyView
          offset={{ closed: -insets.bottom, opened: -insets.bottom / 3 }}
        >
          <ScrollToBottomButton
            visible={showButton}
            onPress={scrollToBottom}
            bottomOffset={80}
          />
          {replyingTo && (
            <ReplyBar message={replyingTo} onCancel={handleCancelReply} />
          )}
          <ChatInput
            onSend={handleSend}
            onHeightChange={handleHeightChange}
            recipientName={displayName}
            blocked={isBlocked}
            groupMembers={isGroupChat ? conversation?.members : null}
            onTypingStart={socket.startTyping}
            onTypingStop={socket.stopTyping}
          />
        </KeyboardStickyView>

        <ChatOverflowMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          isGroup={isGroupChat}
          onLeaveGroup={handleLeaveGroup}
        />

        <MessageActionSheet
          visible={actionSheetVisible}
          onClose={() => {
            setActionSheetVisible(false);
            setMenuMessage(null);
          }}
          onReply={() => {
            if (menuMessage) {
              setReplyingTo(menuMessage);
            }
          }}
          onDelete={handleDeleteMessage}
          isOwnMessage={menuMessage?.sentBy === currentUserId}
          pageY={actionSheetPageY}
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
  emptyRoom: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyRoomText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
