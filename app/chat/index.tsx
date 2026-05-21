import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveAvatar from "@/src/components/chat/ActiveAvatar";
import ConversationRow from "@/src/components/chat/ConversationRow";
import SearchBar from "@/src/components/ui/SearchBar";
import { ACTIVE_USERS, CONVERSATIONS } from "@/src/hooks/mock-data/mock-chat";
import { useRouter } from "expo-router";
import { useChatSearch } from "@/src/hooks/chat/useChatSearch";

const BG = require("@/assets/images/bgbody.png");

export default function MessagesScreen() {
  const router = useRouter(); 
    const {
    query,
    setQuery,
    localResults,
    remoteResults,
    isSearching,
    isFiltering,
  } = useChatSearch(CONVERSATIONS);

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
              {ACTIVE_USERS.map((u) => (
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
                <ConversationRow key={c.id} item={c} onPress={() => router.push(`/chat/${c.id}`)}/>
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