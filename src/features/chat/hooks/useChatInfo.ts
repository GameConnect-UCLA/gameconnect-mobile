/** Hook for shared media, links, and contact info for a conversation */

import { useUserStore } from '@/src/core/store/user.store';
import type {
  ContactInfo,
  Conversation,
  SharedLinkItem,
  SharedMediaItem,
} from '../types/chat.types';

export function useChatInfo(conversation: Conversation | undefined) {
  const isGroup = conversation?.isGroup ?? false;
  const currentUserId = useUserStore((s) => s.user?.id);
  const contact = isGroup
    ? undefined
    : conversation?.members?.find((m) => m.userId !== currentUserId);
  const contactUserId = contact?.userId;

  const sharedMedia: SharedMediaItem[] = [];
  const sharedLinks: SharedLinkItem[] = [];
  const contactInfo: ContactInfo | null = null;

  const mediaCount = 0;
  const linkCount = 0;

  return {
    sharedMedia,
    sharedLinks,
    contactInfo: contactInfo as ContactInfo | null,
    contactUserId: isGroup ? null : (contactUserId ?? null),
    mediaCount,
    linkCount,
  };
}
