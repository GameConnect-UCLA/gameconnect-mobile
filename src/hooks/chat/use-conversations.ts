import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/src/api/chat.api";
import type { Conversation } from "@/src/types/chat.types";

export function useConversations() {
  const query = useQuery<Conversation[], Error>({
    queryKey: ["conversations"],
    queryFn: getConversations,
    retry: false,
  });

  return {
    ...query,
    conversations: query.data ?? [],
  };
}
