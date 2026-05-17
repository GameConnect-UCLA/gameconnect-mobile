import { useState } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/src/api/chat.api";
import { ApiError } from "@/src/api/auth.api";
import { Conversation } from "@/src/types/chat.types";


export function useConversation (conversationId: string) {
    return useQuery<Conversation, ApiError>({
        queryKey: ['conversation', conversationId],
        queryFn: () => getConversation(conversationId),
        enabled: !!conversationId,
        retry: false,
    })
}