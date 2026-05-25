import React, { useState, useEffect, useRef } from "react";
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
import { searchGameProfiles } from "@/src/api/game.api";
import type { GameProfile } from "@/src/types/game.types";
import type { GameInfoCard } from "@/src/types/chat.types";

interface GameSearchModalProps {
  visible: boolean;
  onSelect: (game: GameInfoCard) => void;
  onClose: () => void;
}

function toGameInfoCard(game: GameProfile): GameInfoCard {
  return {
    game_id: game.id,
    title: game.title,
    cover_url: game.cover_url,
    developer: game.developer,
    rating_score: game.rating_score,
    tags: game.tags,
  };
}

export default function GameSearchModal({
  visible,
  onSelect,
  onClose,
}: GameSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GameProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchGameProfiles(query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const handleSelect = (game: GameProfile) => {
    onSelect(toGameInfoCard(game));
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior="padding"
        automaticOffset
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Attach Game Card</Text>
            <View style={styles.closeBtn} />
          </View>

          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#888" />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search games..."
              placeholderTextColor="#aaa"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#033563" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No games found for &ldquo;{query}&rdquo;</Text>
            </View>
          )}

          {!loading && results.length === 0 && !query.trim() && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>Type a game name to search</Text>
            </View>
          )}

          {!loading && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(item)}
                >
                  <Image source={{ uri: item.cover_url }} style={styles.cover} />
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.developer}>{item.developer}</Text>
                  </View>
                  <Ionicons name="add-circle" size={24} color="#033563" />
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="always"
              style={styles.list}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 34,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  closeBtn: {
    width: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#888",
  },
  emptyRow: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
  list: {
    maxHeight: 400,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  developer: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
