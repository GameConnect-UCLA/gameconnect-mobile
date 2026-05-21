import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatSearchBarProps {
  visible: boolean;
  query: string;
  onChangeQuery: (q: string) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  totalResults: number;
  currentIndex: number;
  insetsTop: number;
}

export default function ChatSearchBar({
  visible,
  query,
  onChangeQuery,
  onClose,
  onNext,
  onPrev,
  totalResults,
  currentIndex,
  insetsTop,
}: ChatSearchBarProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -100,
      duration: 200,
      useNativeDriver: true,
    }).start();
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [visible, slideAnim]);

  const clearInput = () => {
    onChangeQuery("");
    inputRef.current?.focus();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insetsTop, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#1a1a1a" />
      </TouchableOpacity>

      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search in chat"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {totalResults > 0 && (
        <View style={styles.navGroup}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onPrev}
            disabled={currentIndex <= 0}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Ionicons
              name="chevron-up"
              size={20}
              color={currentIndex > 0 ? "#1a1a1a" : "#ccc"}
            />
          </TouchableOpacity>
          <Text style={styles.counter}>
            {currentIndex + 1}/{totalResults}
          </Text>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onNext}
            disabled={currentIndex >= totalResults - 1}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Ionicons
              name="chevron-down"
              size={20}
              color={
                currentIndex < totalResults - 1 ? "#1a1a1a" : "#ccc"
              }
            />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "rgba(210, 170, 120, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  closeButton: {
    padding: 6,
    marginRight: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  navGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 2,
  },
  navButton: {
    padding: 6,
  },
  counter: {
    fontSize: 13,
    color: "#1a1a1a",
    minWidth: 36,
    textAlign: "center",
    fontWeight: "500",
  },
});
