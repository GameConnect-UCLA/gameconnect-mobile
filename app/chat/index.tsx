import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
  ImageSourcePropType,
  ImageBackground
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context"; 
import { ActiveUser, Conversation } from "@/src/types/chat.types";
import ActiveAvatar from "@/src/components/chat/ActiveAvatar";
import ConversationRow from "@/src/components/chat/ConversationRow";
const BG = require("@/assets/images/bgbody.png");


// MOCK DATA

const CHAT_IMAGES = {
  luna:    require('@/assets/images/chat/person-1.png'),
  game:    require('@/assets/images/chat/person-2.png'),
  diego:   require('@/assets/images/chat/person-3.png'),
  rpg:     require('@/assets/images/chat/group-1.png'),
  tombraider: require('@/assets/images/chat/group-2.png'),
} as const;

const ACTIVE_USERS: ActiveUser[] = [
  { id: "1", name: "Luna", avatar: CHAT_IMAGES.luna },
  { id: "2", name: "Game", avatar: CHAT_IMAGES.game},
  { id: "3", name: "Diego", avatar: CHAT_IMAGES.diego },
];

const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Luna _Streams",
    avatar: CHAT_IMAGES.luna,
    lastMessage: "¿Ya probaste el nuevo DLC?",
    time: "10:30 AM",
  },
  {
    id: "2",
    name: "GameLink",
    avatar: CHAT_IMAGES.game,
    lastMessage: "¿Jugamos rankend ahora?",
    time: "11:15 AM",
  },
  {
    id: "3",
    name: "Fanáticos de RPG",
    avatar: CHAT_IMAGES.rpg,
    lastMessage: "¿Alguien ya terminó Elden Ring?",
    time: "Ayer",
    memberCount: 4,
    sender: "Luna",
    isGroup: true,
  },
  {
    id: "4",
    name: "Diego_Pro",
    avatar: CHAT_IMAGES.diego,
    lastMessage: "Esa jugada fue épica",
    time: "Ayer",
  },
  {
    id: "5",
    name: "Tomb Raider: Legacy of Atlantis",
    avatar: CHAT_IMAGES.tombraider,
    lastMessage: "Nuevo récord!!",
    time: "Hace dos días",
    memberCount: 3,
    sender: "Luis",
    isGroup: true,
  },
];

export default function MessagesScreen() {
  return (
    <ImageBackground style={styles.safe} source={BG}>
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.headerBack}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mensajes</Text>

        <TouchableOpacity style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          {/* Group icon */}
          <Ionicons name="people-circle" size={styles.groupIcon.width} color={styles.groupIcon.backgroundColor}/>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={styles.searchIcon.width} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversaciones..."
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Active Now */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activos Ahora</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeList}
          >
            {ACTIVE_USERS.map((u) => (
              <ActiveAvatar key={u.id} user={u} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* Conversation list */}
        <View style={styles.convoList}>
          {CONVERSATIONS.map((c) => (
            <ConversationRow key={c.id} item={c} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────


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
    paddingHorizontal: 20,
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
 

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 14,
    gap: 8,
  },
  searchIcon: {
    width: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRIMARY,
    paddingVertical: 0,
  },

  // Section
  section: {
    paddingHorizontal: 20,
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








});