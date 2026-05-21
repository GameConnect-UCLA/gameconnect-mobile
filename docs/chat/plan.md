# Chat Feature Master Plan

This document maps all the requirements, sub-requirements, database schemas, and architectural designs for the GameConnect Mobile Chat MVP.

---

## 1. Requirement Traceability Matrix

### 1.1 Messaging Capabilities

- **Text messages**: Standard text.
- **Image messages**: Render dynamic single/multiple images.
- **Video messages**: Playable inline with play/pause and mute/unmute indicators.
- **Audio messages**: Custom voice clip players (API prevents combining audio attachments with text).
- **Text + Image / Text + Video**: Combines attachments and text within the same message bubble.
- **Links**: Highlight clickable URLs within text bubbles.
- *(Optional)* **Link Previews**: Parse URLs to render high-fidelity rich layout cards.
- *(Optional)* **Profile Mentions**: Typing `@` opens a popup menu to query and tag game profiles in the platform.

### 1.2 Modal Media Pipeline (Captioning & Aspect Ratios)

- **Modal Interception**: Selecting an image or video automatically intercepts the message flow to display a full-screen preview.
- **Caption Input**: Allows writing a caption using the standard keyboard-sticky text input directly inside the preview modal.
- **Native Aspect Ratio**: Bubbles render media matching their original layout height-to-width proportions with minimal paddings. Text captions display styled neatly beneath the media.

### 1.3 Message Interaction & Modifiers

- **Swipe-to-Reply**: Dragging a message bubble from left-to-right triggers an active reply state.
- **Popover Context Menu**: Long-pressing any bubble displays a menu containing "Reply" and "Delete for Everyone".
- **Unified Deletion**: "Delete for Everyone" is the only deletion mode. It erases the record globally for both conversation participants.
- **Clear Chat**: A menu button inside the room overflow sheet. Launches a safe warning alert modal: *"Are you sure you want to clear this chat? This will permanently erase the chat history for both participants."*

### 1.4 Search Navigation

- **Trigger**: A magnifying glass in the chat header triggers a search overlay.
- **Jump & Highlight Navigation**: Navigation buttons ("Up", "Down") cycle through instances of found matches. The view jumps instantly to the target message bubble and briefly highlights the exact matching text background.

### 1.5 Context Screens & Group Management (MVP)

- **Contacts Block Screen**: If the current user blocks a contact, render a blocked interface (input field disabled, text reading *"You have blocked this contact. Unblock to send messages"*).
- **Blank States**:
  - *No conversations active*: Display a clean placeholder card: *"No chats yet. Tap below to find gamers and start a conversation!"*
  - *No messages in room*: Display a placeholder reading: *"Send a message to start your conversation with @[username]"*
- **New Group Creation Screen (`app/chat/newgroup.tsx`)**:
  - Interactive flow to set a group name, choose a group picture, and select members to add.
- **Group Roles & MVP Administration**:
  - In the group members tab of the Chat Info Screen (`app/chat/[id]/info.tsx`), owners can make other members Admins, or demote Admins back to standard Members.
  - *Simple Role Constraints*: Only the Owner can promote members to Admin. Ownership cannot be transferred.

### 1.6 Out of Scope

- Video calls
- Audio calls

---

## 2. Database Schema Alignment

Closely match the definitions in `docs/dbschema.md` to ensure future backend parity:

### conversation

| Column        | Type          | Constraints               |
|---------------|---------------|---------------------------|
| id            | uuid          | pk, not null              |
| name          | varchar(30)   |                           |
| group_picture | text          | url                       |
| created_by    | uuid          | ref: > user.id            |
| created_at    | timestampz    |                           |

### group_member

| Column       | Type        | Constraints                 |
|--------------|-------------|-----------------------------|
| id           | uuid        | pk, not null                |
| user_id      | uuid        | ref: < user.id              |
| conversation | uuid        | ref: < conversation.id      |
| role         | GROUP_ROLE  | OWNER, ADMIN, MEMBER        |
| joined_at    | timestampz  |                             |
| left_at      | timestampz  |                             |

### message

| Column         | Type         | Constraints                        |
|----------------|--------------|------------------------------------|
| id             | uuid         | pk, not null                       |
| sent_by        | uuid         | ref: > user.id                     |
| conversation   | uuid         | null, ref: > conversation.id       |
| reply_to       | uuid         | null, ref: > message.id            |
| type           | MESSAGE_TYPE | GROUP_MESSAGE, DIRECT_MESSAGE      |
| message_text   | text         |                                    |
| attached_media | jsonb        | urls                               |
| sent_at        | timestampz   |                                    |

No additional schema structures are introduced except for an in-memory client-side blocked list tracker to manage blocking capabilities.

---

## 3. Existing Architecture (Current State)

### Screens

| File                                | Purpose                                        |
|-------------------------------------|------------------------------------------------|
| `app/chat/index.tsx`                | Conversation list with "Active Now" users     |
| `app/chat/[id]/index.tsx`           | Chat room screen                              |
| `app/chat/[id]/info.tsx`            | Contact/group info with Media/Files/Links tabs|
| `app/chat/newgroup.tsx`             | Placeholder for group creation                |

### Components

| File                                         | Purpose                              |
|----------------------------------------------|--------------------------------------|
| `src/components/chat/chat-header.tsx`        | Chat room header                     |
| `src/components/chat/chat-input.tsx`         | Message input + attachment menu      |
| `src/components/chat/ChatOverflowMenu.tsx`   | Header overflow (modals, stubs)      |
| `src/components/chat/ConversationRow.tsx`    | Row in conversation list             |
| `src/components/chat/ActiveAvatar.tsx`       | Active user avatar with green dot    |
| `src/components/chat/scroll-to-bottom-button.tsx` | Scroll-to-bottom FAB           |
| `src/components/chat/media-preview.tsx`      | Attachment thumbnails in input       |
| `src/components/chat/media-preview-modal.tsx`| Full-screen media preview modal      |
| `src/components/chat/chat-media-grid.tsx`    | Shared media grid                    |
| `src/components/chat/chat-file-list.tsx`     | Shared files list                    |
| `src/components/chat/chat-link-list.tsx`     | Shared links list                    |
| `src/components/chat/bubble/chat-message-bubble.tsx` | Message bubble wrapper       |
| `src/components/chat/bubble/reply-preview.tsx` | Reply preview in bubble           |
| `src/components/chat/bubble/image-attachment.tsx` | Image attachment rendering    |
| `src/components/chat/bubble/video-attachment.tsx` | Video attachment rendering    |
| `src/components/chat/bubble/audio-attachment.tsx` | Audio attachment rendering    |
| `src/components/chat/bubble/document-attachment.tsx` | Document attachment rendering |
| `src/components/chat/bubble/full-screen-viewer.tsx` | Full screen media viewer    |
| `src/components/chat/bubble/use-media-dimensions.ts` | Media dimension hook        |
| `src/components/chat/bubble/constants.ts`   | Bubble constants                     |
| `src/components/chat/bubble/helpers.ts`      | Bubble helpers                       |

### Hooks

| File                                     | Purpose                                  |
|------------------------------------------|------------------------------------------|
| `src/hooks/chat/useConversation.ts`      | TanStack Query conversation + send       |
| `src/hooks/chat/use-chat-info.ts`        | Shared media, files, links, contact info |
| `src/hooks/chat/useChatSearch.ts`        | Chat list search (local + remote)        |
| `src/hooks/chat/use-scroll-to-bottom.ts` | Scroll position tracking                 |

### API

| File                     | Purpose                         |
|--------------------------|---------------------------------|
| `src/api/chat.api.ts`    | Mock API (send, get)           |

### Types

| File                        | Purpose           |
|-----------------------------|-------------------|
| `src/types/chat.types.ts`   | All chat types    |

---

## 4. Implementation Phases

| Phase | Focus                                      |
|-------|--------------------------------------------|
| 1     | Foundations: empty states, blocking, group creation, deletion/clear mock APIs |
| 2     | Reply (swipe + popover), delete for everyone |
| 3     | Message search with jump + highlight       |
| 4     | Group layout (avatars, usernames, roles) ✅ |
| 5     | Media modal caption integration, aspect ratio fixes |
| 6     | Optional: link previews, @ mentions        |

See `phase_1.md` for detailed execution of Phase 1.

---

## 5. Non-Functional Requirements

- **Styles**: Colors, border-radii, fonts, glassmorphic/sand theme must match existing implementation.
- **Layout**: Confirm wireframes with designer before restructuring layout components.
- **Types**: Strict TypeScript, no `any`. Types must match dbschema.
- **State**: TanStack Query for server data, Zustand for client-only state (blocked users, UI toggles).
- **Components**: UI components receive data via props only. No direct API calls.

---

## 6. Commit Strategy

After completing a logically closed set of changes, create a commit following this pattern:

1. **Stores & foundational layers** → one commit (stores, types, API layer)
2. **Hook layer** → one commit (if separate from above)
3. **UI / screen layer** → one commit per feature group (empty states, blocking, group creation)

Run `npm run lint && npm run typecheck` before every commit. Never commit broken state.

### Suggested commits for Phase 4
| # | Commit Message |
|---|----------------|
| 1 | `feat(chat): add group management API (promote, demote, remove, leave, transfer)` |
| 2 | `feat(chat): add TanStack Query hooks for group member operations` |
| 3 | `feat(chat): add GroupRoleBadge and GroupMemberRow components` |
| 4 | `feat(chat): wire interactive role management in info screen (promote/demote/remove)` |
| 5 | `feat(chat): group-aware chat header and overflow menu (member count, leave group)` |

### Suggested commits for Phase 1
| # | Commit Message |
|---|----------------|
| 1 | `feat(auth): persist current user in Zustand store after login/register` |
| 2 | `feat(chat): add mock APIs and blocked-users store for Phase 1 foundations` |
| 3 | `feat(chat): implement empty states, blocked UI, group creation, block/unblock in info` |
