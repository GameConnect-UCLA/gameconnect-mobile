/** Modal to start a new 1-on-1 conversation */
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
import { useQueryClient } from "@tanstack/react-query";
import { startConversation } from '../../api/chat.api';
import { ACTIVE_USERS } from "@/src/mocks/mock-chat";
import { useChatStore } from '../../store/chat.store';
import type { ActiveUser } from '../../types/chat.types';
import { Colors, Spacing, Typography } from '@/src/core/theme';
import { useNavigation } from '@/src/core/hooks/useNavigation';

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
}

/** Bottom-sheet modal listing users to start a new chat @param props.visible - Modal visibility @param props.onClose - Close handler */
export default function NewConversationModal({
  visible,
  onClose,
}: NewConversationModalProps) {
    const queryClient = useQueryClient();
  const blockedUserIds = useChatStore((s) => s.blockedUserIds);
  const { push } = useNavigation();
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
      push(`/chat/${conversation.id}`);
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
                <ActivityIndicator size="large" color={Colors.primary} />
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
    paddingBottom: Spacing.xxl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    color: "#111",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: Spacing.md,
    height: 40,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    paddingVertical: 0,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: Spacing.sm,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
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
    marginLeft: Spacing.md,
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
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.md,
    color: "#666",
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    color: "#999",
    marginTop: Spacing.xs,
  },
});
