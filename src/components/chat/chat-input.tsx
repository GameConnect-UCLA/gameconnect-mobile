import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim().length === 0) return;
    onSend(message.trim());
    setMessage("");
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.emojiButton}>
        <Ionicons name="happy-outline" size={26} color="#888" />
      </TouchableOpacity>

      <TextInput
        style={styles.textInput}
        placeholder="Message"
        placeholderTextColor="#aaa"
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity
        style={styles.micButton}
        onPress={message.length > 0 ? handleSend : undefined}
      >
        <Ionicons
          name={message.length > 0 ? "send" : "mic-outline"}
          size={26}
          color={message.length > 0 ? "#033563" : "#888"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: "#e8e8e8",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emojiButton: {
    padding: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  micButton: {
    padding: 4,
  },
});
