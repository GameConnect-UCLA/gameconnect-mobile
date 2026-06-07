/** Hook for chat list with local search and remote user search */
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/src/features/chat/api/chat.api";
import { useChatStore } from "@/src/features/chat/store/chat.store";
import { useDebounce } from "@/src/core/hooks/useDebounce";
import type { Conversation } from "@/src/features/chat/types/chat.types";

async function searchUsers(query: string): Promise<Conversation[]> {
  return [];
}

/** Manage conversation list with local filtering and remote search @returns Conversations, query state, and search status */
export function useChatList() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const hiddenConversationIds = useChatStore((s) => s.hiddenConversationIds);

  const { data = [], ...queryRest } = useQuery<Conversation[], Error>({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });

  const allConversations = data.filter(
    (c) => !hiddenConversationIds.includes(c.id),
  );

  const localResults = useMemo(() => {
    if (!query.trim()) return allConversations;
    const lower = query.toLowerCase();
    return allConversations.filter((c) =>
      c.name?.toLowerCase().includes(lower),
    );
  }, [query, allConversations]);

  const isFiltering = query.trim().length > 0;
  const shouldSearchRemote = isFiltering && localResults.length === 0;

  const { data: remoteResults = [], isFetching: isSearching } = useQuery({
    queryKey: ["userSearch", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: shouldSearchRemote && debouncedQuery.trim().length > 0,
    staleTime: 30_000,
  });

  const results = isFiltering && localResults.length === 0 ? remoteResults : localResults;

  return {
    ...queryRest,
    conversations: results,
    query,
    setQuery,
    isSearching,
    isFiltering,
  };
}
