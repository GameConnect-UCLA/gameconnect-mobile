/** Hook for searching conversations with local + remote (stub) fallback */
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/src/core/hooks/useDebounce";
import { Conversation } from '../types/chat.types';

async function searchUsers(query: string): Promise<Conversation[]> {
  // TODO: return await apiClient.get(`/users/search?q=${query}`)
  return [];
}

/** Filter conversation list locally and fall back to remote search stub @param conversations - Full conversation list @returns Query, search results, and filtering state */
export function useChatSearch(conversations: Conversation[]) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const localResults = useMemo(() => {
    if (!query.trim()) return conversations;
    const lower = query.toLowerCase();
    return conversations.filter((c) =>
      c.name?.toLowerCase().includes(lower)
    );
  }, [query, conversations]);

  const isFiltering = query.trim().length > 0;
  const shouldSearchRemote = isFiltering && localResults.length === 0;

  // TanStack Query maneja loading, error, cache y cleanup.
  // `enabled` reemplaza el if-guard que antes vivía dentro del useEffect.
  // `debouncedQuery` como queryKey garantiza que solo fetcha cuando
  // el usuario dejó de escribir, no en cada keystroke.
  const { data: remoteResults = [], isFetching: isSearching } = useQuery({
    queryKey: ["userSearch", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: shouldSearchRemote && debouncedQuery.trim().length > 0,
    staleTime: 30_000, // evita re-fetch si el usuario repite la misma query
  });

  return {
    query,
    setQuery,
    localResults,
    remoteResults,
    isSearching,
    isFiltering,
  };
}