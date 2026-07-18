/** Hook for mention (`@`) autocomplete in chat input */
import { useState, useCallback } from "react";
import type { GroupMember } from "@/src/features/chat/types/chat.types";

/** State shape for autocomplete UI @property mentionQuery - Current mention query string @property mentionVisible - Whether suggestions are shown @property selection - Current cursor position */
export interface AutocompleteState {
  mentionQuery: string;
  mentionVisible: boolean;
  selection: { start: number; end: number };
}

/** Manage mention (`@`) detection and suggestion selection @param isGroup - Whether the conversation is a group @returns Autocomplete state and handlers */
export function useAutocomplete(isGroup: boolean) {
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionVisible, setMentionVisible] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const detectAutocomplete = useCallback(
    (text: string, cursorPos: number) => {
      if (!isGroup) {
        setMentionVisible(false);
        return;
      }

      const beforeCursor = text.slice(0, cursorPos);
      const atIndex = beforeCursor.lastIndexOf("@");
      if (atIndex === -1) {
        setMentionVisible(false);
        return;
      }

      const beforeAt = atIndex === 0 ? " " : beforeCursor[atIndex - 1];
      if (beforeAt !== " " && beforeAt !== "\n") {
        setMentionVisible(false);
        return;
      }

      const afterAt = beforeCursor.slice(atIndex + 1);
      if (!/^[a-zA-Z0-9_]*$/.test(afterAt)) {
        setMentionVisible(false);
        return;
      }

      setMentionQuery(afterAt);
      setMentionVisible(true);
    },
    [isGroup],
  );

  const handleMentionSelect = useCallback(
    (member: GroupMember, message: string, setMessage: (t: string) => void) => {
      const beforeCursor = message.slice(0, selection.start);
      const atIndex = beforeCursor.lastIndexOf("@");
      if (atIndex === -1) return;

      const mention = `@${member.username ?? "unknown"} `;
      const newText =
        message.slice(0, atIndex) + mention + message.slice(selection.start);
      const newCursor = atIndex + mention.length;

      setMessage(newText);
      setSelection({ start: newCursor, end: newCursor });
      setMentionVisible(false);
    },
    [selection.start],
  );

  const handleSelectionChange = useCallback(
    (e: { nativeEvent: { selection: { start: number; end: number } } }) => {
      setSelection(e.nativeEvent.selection);
    },
    [],
  );

  return {
    mentionQuery,
    mentionVisible,
    setMentionVisible,
    selection,
    setSelection,
    detectAutocomplete,
    handleMentionSelect,
    handleSelectionChange,
  };
}
