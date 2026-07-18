/** Hook for fetching all conversations with hidden-filtering */
import { useQuery } from "@tanstack/react-query";
import { getConversations } from '../api/chat.api';
import { useChatStore } from '../store/chat.store';
import type { Conversation } from '../types/chat.types';

/** Fetch conversation list, excluding hidden conversations @returns TanStack Query result with filtered conversations */
export function useConversations() {
  const hiddenConversationIds = useChatStore((s) => s.hiddenConversationIds);

  const query = useQuery<Conversation[], Error>({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });

  const conversations = (query.data ?? []).filter(
    (c) => !hiddenConversationIds.includes(c.id),
  );

  return {
    ...query,
    conversations,
  };
}
