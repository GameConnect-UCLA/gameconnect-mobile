/** Hook for group member management mutations with optimistic updates */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  promoteMember as apiPromoteMember,
  demoteMember as apiDemoteMember,
  removeMember as apiRemoveMember,
  leaveGroup as apiLeaveGroup,
  transferOwnership as apiTransferOwnership,
  addMemberToGroup as apiAddMember,
} from '../api/chat.api';
import type { Conversation } from '../types/chat.types';
import { GroupRole } from '../types/chat.types';

/** Mutations for group member actions: promote, demote, remove, leave, transfer, add @param conversationId - Group conversation UUID @returns Mutation functions and pending flags for each action */
export function useGroupMembers(conversationId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["conversation", conversationId];

  const promoteMutation = useMutation({
    mutationFn: (memberId: string) => apiPromoteMember(conversationId, memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Conversation>(queryKey);
      if (previous?.members) {
        queryClient.setQueryData<Conversation>(queryKey, {
          ...previous,
          members: previous.members.map((m) =>
            m.id === memberId ? { ...m, role: GroupRole.ADMIN } : m,
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const demoteMutation = useMutation({
    mutationFn: (memberId: string) => apiDemoteMember(conversationId, memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Conversation>(queryKey);
      if (previous?.members) {
        queryClient.setQueryData<Conversation>(queryKey, {
          ...previous,
          members: previous.members.map((m) =>
            m.id === memberId ? { ...m, role: GroupRole.MEMBER } : m,
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => apiRemoveMember(conversationId, memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Conversation>(queryKey);
      if (previous?.members) {
        queryClient.setQueryData<Conversation>(queryKey, {
          ...previous,
          members: previous.members.filter((m) => m.id !== memberId),
          memberCount: Math.max(1, (previous.memberCount ?? 1) - 1),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => apiLeaveGroup(conversationId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const transferOwnershipMutation = useMutation({
    mutationFn: (memberId: string) => apiTransferOwnership(conversationId, memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Conversation>(queryKey);
      if (previous?.members) {
        const currentOwnerId = previous.members.find(
          (m) => m.role === GroupRole.OWNER,
        )?.id;
        queryClient.setQueryData<Conversation>(queryKey, {
          ...previous,
          members: previous.members.map((m) => {
            if (m.id === currentOwnerId) return { ...m, role: GroupRole.ADMIN };
            if (m.id === memberId) return { ...m, role: GroupRole.OWNER };
            return m;
          }),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) => apiAddMember(conversationId, userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Conversation>(queryKey);
      if (previous?.members) {
        const newMember = {
          id: `gm-${Date.now()}`,
          userId: userId,
          conversation: "",
          role: GroupRole.MEMBER,
          joinedAt: new Date().toISOString(),
          leftAt: null,
          username: `User ${userId}`,
          profilePic: null,
        };
        queryClient.setQueryData<Conversation>(queryKey, {
          ...previous,
          members: [...previous.members, newMember],
          memberCount: (previous.memberCount ?? 0) + 1,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    promoteMember: promoteMutation.mutateAsync,
    isPromoting: promoteMutation.isPending,
    demoteMember: demoteMutation.mutateAsync,
    isDemoting: demoteMutation.isPending,
    removeMember: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    leaveGroup: leaveMutation.mutateAsync,
    isLeaving: leaveMutation.isPending,
    transferOwnership: transferOwnershipMutation.mutateAsync,
    isTransferring: transferOwnershipMutation.isPending,
    addMember: addMemberMutation.mutateAsync,
    isAdding: addMemberMutation.isPending,
  };
}
