import React, { useState, useCallback } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MAX_INPUT_HEIGHT = 120;

interface ChatInputProps {
  onSend: (text: string) => void;
  onHeightChange?: (height: number) => void;
}

export default function ChatInput({ onSend, onHeightChange }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);

  const handleSend = () => {
    if (message.trim().length === 0) return;
    onSend(message.trim());
    setMessage("");
  };

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const newHeight = Math.min(
        Math.max(event.nativeEvent.contentSize.height, 0),
        MAX_INPUT_HEIGHT
      );
      setInputHeight(newHeight);
      onHeightChange?.(newHeight + 16); // Add vertical padding
    },
    [onHeightChange]
  );

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.emojiButton}>
        <Ionicons name="happy-outline" size={26} color="#888" />
      </TouchableOpacity>

      <TextInput
        style={[
          styles.textInput,
          { height: Math.max(40, inputHeight) },
        ]}
        placeholder="Message"
        placeholderTextColor="#aaa"
        value={message}
        onChangeText={setMessage}
        multiline
        textAlignVertical="top"
        onContentSizeChange={handleContentSizeChange}
        maxLength={2000}
      />

      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSend}
        activeOpacity={0.7}
      >
        <Ionicons
          name={message.trim().length > 0 ? "send" : "mic-outline"}
          size={26}
          color={message.trim().length > 0 ? "#033563" : "#888"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 12,
    backgroundColor: "#e8e8e8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  emojiButton: {
    padding: 4,
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    lineHeight: 20,
  },
  sendButton: {
    padding: 4,
    paddingBottom: 10,
  },
});
