import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveAvatar from "@/src/components/chat/ActiveAvatar";
import ConversationRow from "@/src/components/chat/ConversationRow";
import SearchBar from "@/src/components/ui/SearchBar";
import { ACTIVE_USERS, CONVERSATIONS } from "@/src/hooks/mock-data/mock-chat";
const BG = require("@/assets/images/bgbody.png");

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
            <Ionicons name="people-circle" size={styles.groupIcon.width} color={styles.groupIcon.backgroundColor} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar />

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