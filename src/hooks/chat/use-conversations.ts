import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/src/api/chat.api";
import { useChatStore } from "@/src/store/chat.store";
import type { Conversation } from "@/src/types/chat.types";

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
