import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { startConversation } from "@/src/api/chat.api";
import { ACTIVE_USERS } from "@/src/hooks/mock-data/mock-chat";
import { useChatStore } from "@/src/store/chat.store";
import type { ActiveUser } from "@/src/types/chat.types";

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewConversationModal({
  visible,
  onClose,
}: NewConversationModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const blockedUserIds = useChatStore((s) => s.blockedUserIds);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  const filteredUsers = useMemo(() => {
    const lower = query.toLowerCase().trim();
    return ACTIVE_USERS.filter(
      (u) =>
        !blockedUserIds.includes(u.id) &&
        (lower === "" || u.username.toLowerCase().includes(lower)),
    );
  }, [query, blockedUserIds]);

  const handleSelect = async (user: ActiveUser) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const conversation = await startConversation(user.id);
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onClose();
      router.push(`/chat/${conversation.id}`);
    } catch {
      // error handled silently — mock only
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: { item: ActiveUser }) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() => handleSelect(item)}
      activeOpacity={0.6}
    >
      <Image
        source={
          item.profile_pic
            ? { uri: item.profile_pic }
            : require("@/assets/images/default-avatar.jpg")
        }
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior="padding"
        automaticOffset
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.sheetContainer}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.title}>New Conversation</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close" size={24} color="#111" />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={18}
                  color="#999"
                  style={styles.searchIcon}
                />
                <TextInput
                  ref={inputRef}
                  style={styles.searchInput}
                  placeholder="Search users..."
                  placeholderTextColor="#999"
                  value={query}
                  onChangeText={setQuery}
                  returnKeyType="search"
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery("")}>
                    <Ionicons name="close-circle" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>

            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#033563" />
                <Text style={styles.loadingText}>Creating conversation...</Text>
              </View>
            ) : filteredUsers.length === 0 ? (
              <View style={styles.center}>
                <Ionicons name="person-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            ) : (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={renderUser}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    paddingVertical: 0,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ccc",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
});
