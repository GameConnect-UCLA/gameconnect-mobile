import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveAvatar from "@/src/components/chat/ActiveAvatar";
import ConversationRow from "@/src/components/chat/ConversationRow";
import ConversationActionsSheet from "@/src/components/chat/ConversationActionsSheet";
import NewConversationModal from "@/src/components/chat/new-conversation-modal";
import SearchBar from "@/src/components/ui/SearchBar";
import { ACTIVE_USERS } from "@/src/hooks/mock-data/mock-chat";
import { useRouter } from "expo-router";
import { useChatSearch } from "@/src/hooks/chat/useChatSearch";
import { useConversations } from "@/src/hooks/chat/use-conversations";
import { useChatStore } from "@/src/store/chat.store";
import { leaveGroup, getCurrentUserId } from "@/src/api/chat.api";
import { GroupRole } from "@/src/types/chat.types";
import type { Conversation } from "@/src/types/chat.types";

const BG = require("@/assets/images/bgbody.png");

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations } = useConversations();
  const hideConversation = useChatStore((s) => s.hideConversation);
  const hiddenConversationIds = useChatStore((s) => s.hiddenConversationIds);
  const visibleActiveUsers = ACTIVE_USERS.filter(
    (u) => !hiddenConversationIds.includes(u.conversationId ?? ""),
  );
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showNewConvo, setShowNewConvo] = useState(false);

  const handleLongPress = (c: Conversation) => {
    setSelectedConvo(c);
    setShowActions(true);
  };

  const handleOpenChat = () => {
    if (!selectedConvo) return;
    setShowActions(false);
    router.push(`/chat/${selectedConvo.id}`);
  };

  const handleMute = () => {
    setShowActions(false);
    Alert.alert("Mute Notifications", "Coming soon.");
  };

  const handleReport = () => {
    setShowActions(false);
    Alert.alert("Report", "Coming soon.");
  };

  const handleDelete = async () => {
    if (!selectedConvo) return;
    const isGroup = selectedConvo.is_group;
    const currentUserId = getCurrentUserId();
    const isOwner = selectedConvo.members?.some(
      (m) => m.user_id === currentUserId && m.role === GroupRole.OWNER,
    );
    const label = isGroup ? (isOwner ? "Delete Group" : "Leave Group") : "Delete Chat";
    const message = isGroup
      ? `Are you sure you want to ${isOwner ? "delete this group" : "leave this group"}?`
      : "Delete this conversation?";

    Alert.alert(label, message, [
      { text: "Cancel", style: "cancel" },
      {
        text: label,
        style: "destructive",
        onPress: async () => {
          if (isGroup) {
            try {
              await leaveGroup(selectedConvo.id);
            } catch {
              // mock — ignore
            }
          }
          hideConversation(selectedConvo.id);
          setShowActions(false);
        },
      },
    ]);
  };
    const {
    query,
    setQuery,
    localResults,
    remoteResults,
    isSearching,
    isFiltering,
  } = useChatSearch(conversations);

  return (
    <ImageBackground style={styles.safe} source={BG}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={() => router.back()}>
            <Text style={styles.headerBack}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mensajes</Text>

          <TouchableOpacity style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={() => router.push("/chat/newgroup")}>
            {/* Group icon */}
            <Ionicons name="people-circle" size={styles.groupIcon.width} color={styles.groupIcon.backgroundColor} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search chats..." />



        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          {/* Active Now */}

          {!isFiltering && (
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activos Ahora</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeList}
            >
              {visibleActiveUsers.map((u) => (
                <ActiveAvatar key={u.id} user={u} onPress={() => router.push(`/chat/${u.conversationId}`)} />
              ))}
            </ScrollView>
          </View>
          )}
          
          {!isFiltering &&  <View style={styles.divider} />}

          {/* Local Search Results */}

          {localResults.length > 0 ? (

            <View style={styles.convoList}>
              {isFiltering && (
                 <View style={styles.section}>
                <Text style={styles.sectionTitle}>Conversaciones</Text>
                </View>
              )}
              {localResults.map((c) => (
                <ConversationRow key={c.id} item={c} onPress={() => router.push(`/chat/${c.id}`)} onLongPress={() => handleLongPress(c)}/>
              ))}
            </View>
          ) : (
             isFiltering && !isSearching && remoteResults.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No se encontraron conversaciones con &ldquo;{query}&rdquo;
                </Text>
              </View>
            )
          )}

          {!isFiltering && localResults.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#999" />
              <Text style={styles.emptyTitle}>No chats yet</Text>
              <Text style={styles.emptySubtitle}>
                Search above or start a new conversation with a gamer!
              </Text>
            </View>
          )}

          {/* Remote Search Results */}

           {isFiltering && (isSearching || remoteResults.length > 0) && (
            <View style={styles.convoList}>
               <View style={styles.section}>
              <Text style={styles.sectionTitle}>Usuarios</Text>
              </View>
              {isSearching ? (
                <ActivityIndicator
                  size="small"
                  color="#033563"
                />
              ) : (
                remoteResults.map((u) => (
                  <ConversationRow key={u.id} item={u} onPress={() => router.push(`/chat/${u.id}`)} />
                ))
              )}
            </View>
          )}

        </ScrollView>

        {/* New Conversation FAB */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.7}
          onPress={() => setShowNewConvo(true)}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <ConversationActionsSheet
          visible={showActions}
          conversation={selectedConvo}
          onClose={() => setShowActions(false)}
          onOpenChat={handleOpenChat}
          onMute={handleMute}
          onReport={handleReport}
          onDelete={handleDelete}
        />
        <NewConversationModal
          visible={showNewConvo}
          onClose={() => setShowNewConvo(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const TEXT_PRIMARY = "#111";

const DIVIDER = "rgba(0,0,0,0.08)";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBack: {
    fontSize: 32,
    color: TEXT_PRIMARY,
    marginTop: -4,
    lineHeight: 36,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: 0.2,
  },
  groupIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#033563",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // Section
  section: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 14,
  },

  // Active users
  activeList: {
    gap: 20,
    paddingRight: 4,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginHorizontal: 0,
  },

  // Conversations
  convoList: {
    paddingTop: 4,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  // FAB
  fab: {
    position: "absolute",
    right: 16,
    bottom: 90,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#033563",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // No results
  noResultsContainer: {
    padding: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
});