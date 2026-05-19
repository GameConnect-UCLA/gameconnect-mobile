import type {
  ContactInfo,
  Conversation,
  SharedFileItem,
  SharedLinkItem,
  SharedMediaItem,
} from "@/src/types/chat.types";
import {
  MOCK_CONTACT_INFO,
  MOCK_SHARED_FILES,
  MOCK_SHARED_LINKS,
  MOCK_SHARED_MEDIA,
} from "@/src/hooks/mock-data/mock-chat";

export function useChatInfo(conversation: Conversation | undefined) {
  const conversationId = conversation?.id ?? "";
  const isGroup = conversation?.is_group ?? false;
  const contact = conversation?.members?.[0];
  const contactUserId = contact?.user_id;

  const sharedMedia: SharedMediaItem[] =
    MOCK_SHARED_MEDIA[conversationId] ?? [];

  const sharedFiles: SharedFileItem[] =
    MOCK_SHARED_FILES[conversationId] ?? [];

  const sharedLinks: SharedLinkItem[] =
    MOCK_SHARED_LINKS[conversationId] ?? [];

  const contactInfo: ContactInfo | null = !isGroup && contactUserId
    ? (MOCK_CONTACT_INFO[contactUserId] ?? null)
    : null;

  const mediaCount = sharedMedia.length;
  const fileCount = sharedFiles.length;
  const linkCount = sharedLinks.length;

  return {
    sharedMedia,
    sharedFiles,
    sharedLinks,
    contactInfo,
    mediaCount,
    fileCount,
    linkCount,
  };
}
