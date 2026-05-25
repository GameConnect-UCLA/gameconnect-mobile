# Phase 1: Foundations — Empty States, Blocking, Group Creation, Deletion/Clear APIs

This file serves as a self-contained checkpoint for implementing the foundational Phase 1 of the Chat MVP.

---

## Objective

Establish the mock persistence layer for message deletion and room-clearing, implement the blank states across the chat list and conversation windows, create the group instantiation screen, and configure blocking states.

---

## 1. Mock State & API Layer Updates

### Files to modify

- `src/api/chat.api.ts`
- `src/types/chat.types.ts` (if new types needed)
- `src/hooks/mock-data/mock-chat.ts` (if mock data needs extending)

### Requirements

1. **Blocked Users State**: Create an in-memory `Set<string>` or array `BLOCKED_USERS` containing blocked user IDs. Expose via a simple module-level getter/setter or a Zustand store.
2. **API Endpoints** (mock, with simulated latency):

   | Endpoint | Signature | Behavior |
   |----------|-----------|----------|
   | `deleteMessage(conversationId, messageId)` | `async (conversationId: string, messageId: string) => void` | Filters the message out of the conversation's `messages` array in mock data |
   | `clearChatHistory(conversationId)` | `async (conversationId: string) => void` | Sets `conversation.messages = []` and resets `last_message`, `last_message_time` |
   | `blockUser(userId)` | `async (userId: string) => void` | Adds userId to BLOCKED_USERS |
   | `unblockUser(userId)` | `async (userId: string) => void` | Removes userId from BLOCKED_USERS |
   | `createGroup(name, groupPic, memberIds)` | `async (name, groupPic, memberIds) => Conversation` | Creates a new Conversation with `is_group: true`, adds members with roles, returns new conversation |

3. **Block Check Helper**: Export `isBlocked(userId: string): boolean` for use in components.

---

## 2. Empty State Displays

### Files to modify

- `app/chat/index.tsx` (chat list empty state)
- `app/chat/[id]/index.tsx` (no messages state)
- `src/components/chat/chat-input.tsx` (blocked state)

### 2.1 Chat List Empty State (`app/chat/index.tsx`)

**Condition**: When `localResults.length === 0` AND `!isFiltering`.

**UI**: Render a centered placeholder card with:
- An icon (e.g., `chatbubbles-outline` from Ionicons)
- Title text: *"No chats yet"*
- Subtitle text: *"Search above or start a new conversation with a gamer!"*
- Keep the existing background image and glassmorphic style.

### 2.2 Empty Message Room State (`app/chat/[id]/index.tsx`)

**Condition**: When `messages.length === 0` (and not loading/error).

**UI**: Render a centered view between header and input:
- Text: *"Send a message to start your conversation with {displayName}"*
- Styled with existing typography (fontSize 16, color `#666` or similar muted tone)

### 2.3 Blocked Contact State (`app/chat/[id]/index.tsx` + `chat-input.tsx`)

**Condition**: Check if `contact?.user_id` is in `BLOCKED_USERS`.

**UI**:
- Disable the text input (`editable={false}`)
- Change placeholder text to *"You have blocked this contact"*
- Hide the attachment (+) button
- Optionally show a banner above the input: *"You have blocked this contact. Unblock to send messages."*

---

## 3. Group Creation Screen (`app/chat/newgroup.tsx`)

### Files to modify

- `app/chat/newgroup.tsx` (rewrite from placeholder)

### Requirements

1. **Screen Layout** (ScrollView with glassmorphic containers):
   - **Group Name**: `TextInput` with placeholder "Group name"
   - **Group Picture**: Tappable avatar circle that picks an image via `expo-image-picker`
   - **Member Selection**: List of users (from mock `USERS` or `ACTIVE_USERS`) with checkboxes/toggles
   - **Create Button**: Prominent button at bottom

2. **Behavior**:
   - Tapping "Create" calls `createGroup(name, groupPicUri, selectedMemberIds)`
   - On success, navigate to the new conversation: `router.push(\`/chat/${newConvoId}\`)`
   - On error, show an Alert

3. **Validation**:
   - Group name is required (min 1 char, max 30)
   - At least 2 members selected (plus the creator)
   - Show validation errors inline or via Alert

---

## 4. Block/Unblock Integration in Chat Info Screen

### File to modify

- `app/chat/[id]/info.tsx`

### Requirements

1. **Block Button Behavior**: Replace `handleDeadAction("Block")` with actual logic:
   - If not blocked: show "Block" button → calls `blockUser(contactUserId)` → updates UI
   - If blocked: show "Unblock" button → calls `unblockUser(contactUserId)` → updates UI
   - Use the existing `Alert.alert` for confirmation before blocking/unblocking

2. **Visual Feedback**: Toggle the button icon and text based on block state:
   - Blocked: `remove-circle` icon, red tint, text "Unblock"
   - Not blocked: `remove-circle-outline` icon, default color, text "Block"

---

## 5. Existing Architecture Context

### Current Mock Data

Located in `src/hooks/mock-data/mock-chat.ts`:
- `CONVERSATIONS`: Array of Conversation objects
- `ACTIVE_USERS`: Array of ActiveUser objects
- `MOCK_SHARED_MEDIA`, `MOCK_SHARED_FILES`, `MOCK_SHARED_LINKS`: Shared content
- `MOCK_CONTACT_INFO`: Contact details

### Current Types

Located in `src/types/chat.types.ts`:
- `Conversation`, `Message`, `Attachment`, `GroupMember`, `ActiveUser`, `SharedMediaItem`, `SharedFileItem`, `SharedLinkItem`, `ContactInfo`
- Enums: `MessageType`, `AttachmentType`, `GroupRole`, `UserRole`, `UserState`

### Current API

Located in `src/api/chat.api.ts`:
- `getConversation(id)`: Returns a conversation
- `sendMessage(conversationId, text, attachments, senderId)`: Sends a message

### Current Hooks

Located in `src/hooks/chat/`:
- `useConversation(id)`: Returns `{ data, messages, isLoading, error, sendMessage, isSending }`
- `useChatInfo(conversation)`: Returns `{ sharedMedia, sharedFiles, sharedLinks, contactInfo }`
- `useChatSearch(conversations)`: Returns search results
- `useScrollToBottom()`: Returns scroll controls

---

## 6. Dependencies

- `expo-image-picker` (already in project)
- No new packages required

---

## 7. Verification Checklist

- [ ] Chat list shows empty state when no conversations exist
- [ ] Chat room shows welcome message when no messages exist
- [ ] Blocking a user disables the chat input and shows blocked banner
- [ ] Unblocking restores normal chat functionality
- [ ] New group creation flow works end-to-end
- [ ] Group appears in conversation list after creation
- [ ] Delete message API endpoint works (even if not wired to UI yet)
- [ ] Clear chat history API endpoint works
- [ ] Types remain aligned with `docs/dbschema.md`
- [ ] No lint errors (`npm run lint`)
- [ ] No type errors (`npm run typecheck`)
