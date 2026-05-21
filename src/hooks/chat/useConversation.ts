import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversation, sendMessage as apiSendMessage } from "@/src/api/chat.api";
import { ApiError } from "@/src/api/auth.api";
import { useUserStore } from "@/src/store/user.store";
import type { Attachment, Conversation, Message } from "@/src/types/chat.types";
import { MessageType } from "@/src/types/chat.types";

export function useConversation(conversationId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["conversation", conversationId];
  const currentUserId = useUserStore((s) => s.user?.id ?? "current_user");

  const conversationQuery = useQuery<Conversation, ApiError>({
    queryKey,
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({
      text,
      attachments,
    }: {
      text: string | null;
      attachments?: Attachment[] | null;
    }) => apiSendMessage(conversationId, text, attachments, currentUserId),

    onMutate: async ({ text, attachments }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousConversation =
        queryClient.getQueryData<Conversation>(queryKey);

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        sent_by: currentUserId,
        conversation: conversationId,
        reply_to: null,
        type: previousConversation?.is_group
          ? MessageType.GROUP_MESSAGE
          : MessageType.DIRECT_MESSAGE,
        message_text: text,
        attached_media: attachments ?? null,
        sent_at: new Date().toISOString(),
        sender_username: "You",
        sender_profile_pic: null,
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
    sendMessage: (text: string | null, attachments?: Attachment[] | null) =>
      sendMessageMutation.mutateAsync({ text, attachments }),
    isSending: sendMessageMutation.isPending,
  };
}
