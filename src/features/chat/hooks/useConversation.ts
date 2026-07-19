/** Hook for single conversation data with optimistic send-message */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversation, sendMessage as apiSendMessage } from '../api/chat.api';
import { useUserStore } from "@/src/core/store/user.store";
import type { Attachment, Conversation, GameInfoCard, Message } from '../types/chat.types';
import { MessageType } from '../types/chat.types';

/** Fetch a conversation and expose sendMessage with optimistic update @param conversationId - Conversation UUID @returns Conversation query data, messages, sendMessage function, isSending flag */
export function useConversation(conversationId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["conversation", conversationId];
  const currentUserId = useUserStore((s) => s.user?.id ?? "currentUser");

  const conversationQuery = useQuery<Conversation, Error>({
    queryKey,
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
    retry: false,
  });


  const sendMessageMutation = useMutation({
    mutationFn: ({
      text,
      attachments,
      replyToId,
      gameCard,
    }: {
      text: string | null;
      attachments?: Attachment[] | null;
      replyToId?: string | null;
      gameCard?: GameInfoCard | null;
    }) =>
      apiSendMessage(
        conversationId,
        text,
        attachments,
        currentUserId,
        replyToId,
        gameCard,
      ),

    onMutate: async ({ text, attachments, replyToId, gameCard }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousConversation =
        queryClient.getQueryData<Conversation>(queryKey);

      const repliedMessage = replyToId
        ? previousConversation?.messages?.find((m) => m.id === replyToId) ?? null
        : null;

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        sentBy: currentUserId,
        conversation: conversationId,
        replyTo: replyToId ?? null,
        type: previousConversation?.isGroup
          ? MessageType.GROUP_MESSAGE
          : MessageType.DIRECT_MESSAGE,
        messageText: text,
        attachedMedia: attachments ?? null,
        sentAt: new Date().toISOString(),
        senderUsername: "You",
        senderProfilePic: null,
        replyToMessage: repliedMessage,
        gameCard: gameCard ?? null,
      };

      if (previousConversation) {
        queryClient.setQueryData<Conversation>(queryKey, {
          ...previousConversation,
          messages: [...(previousConversation.messages || []), optimisticMessage],
        });
      }

      return { previousConversation };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousConversation) {
        queryClient.setQueryData(queryKey, context.previousConversation);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    ...conversationQuery,
    messages: conversationQuery.data?.messages ?? [],
    sendMessage: (
      text: string | null,
      attachments?: Attachment[] | null,
      replyToId?: string | null,
      gameCard?: GameInfoCard | null,
    ) => sendMessageMutation.mutateAsync({ text, attachments, replyToId, gameCard }),
    isSending: sendMessageMutation.isPending,
  };
}
