/** Hook for shared media, links, and contact info for a conversation */
import type {
  ContactInfo,
  Conversation,
  SharedLinkItem,
  SharedMediaItem,
} from '../types/chat.types';
import {
  MOCK_CONTACT_INFO,
  MOCK_SHARED_LINKS,
  MOCK_SHARED_MEDIA,
} from "@/src/mocks/mock-chat";

/** Fetch shared media, links, and contact info (currently mock data) @param conversation - The conversation object @returns { sharedMedia, sharedLinks, contactInfo, contactUserId, mediaCount, linkCount } */
export function useChatInfo(conversation: Conversation | undefined) {
  const conversationId = conversation?.id ?? "";
  const isGroup = conversation?.is_group ?? false;
  const contact = conversation?.members?.[0];
  const contactUserId = contact?.user_id;

  const sharedMedia: SharedMediaItem[] =
    MOCK_SHARED_MEDIA[conversationId] ?? [];

  const sharedLinks: SharedLinkItem[] =
    MOCK_SHARED_LINKS[conversationId] ?? [];

  const contactInfo: ContactInfo | null = !isGroup && contactUserId
    ? (MOCK_CONTACT_INFO[contactUserId] ?? null)
    : null;

  const mediaCount = sharedMedia.length;
  const linkCount = sharedLinks.length;

  return {
    sharedMedia,
    sharedLinks,
    contactInfo,
    contactUserId: !isGroup ? contactUserId : null,
    mediaCount,
    linkCount,
  };
}
