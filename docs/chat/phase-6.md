# Phase 6: Links, @Mentions, @Game Cards

Self-contained checkpoint for implementing link formatting, @member mentions in groups, and @game `<query>` game profile search with info card attachment.

---

## Objective

Add 3 features to chat messages:

1. **Links**: Auto-detect URLs in `message_text`, render clickable (styled blue + underline, tap opens via `Linking.openURL`)
2. **@Mentions**: Autocomplete dropdown when typing `@` in group chats (list group members). On send, parse `@username` pattern, render as styled tappable chip in bubble. Tap navigates to user profile.
3. **@Game** `<query>`: Autocomplete when typing `@game ` in any chat. Searches mock game profiles. Selecting a game attaches a `GameInfoCard` to the message (rich card with cover image, title, developer, rating). Card renders inside bubble, tappable → navigates to game profile.

All mock data, no backend. Minimal surgical changes. No impact outside chat.

---

## Decisions

| Decision | Choice |
|----------|--------|
| Link rendering | Styled (blue/underline) + tappable via `Linking.openURL` |
| @mention scope | Group members only |
| @mention autocomplete | Show dropdown on `@` typing, filtered by username |
| @mention send behavior | Parse `@username` in text, render styled chip |
| @mention tap | Navigate to user profile (`user/[id]`) |
| @game trigger | User types `@game ` → autocomplete dropdown |
| @game selection | Replace `@game <query>` text with card attachment |
| Game card data source | `GameProfile` type from `game.types.ts` |
| Game mock data | New `GameProfile`-shaped mock data (not `FavoriteGame`) |
| Game search mechanism | In-memory mock search (synchronous filter, Promise-wrapped) |
| Game card visual | Rich card inside bubble (image, title, developer, rating, tags) |
| Game card tap | Navigate to game profile page |
| @game scope | Any chat (DM + group) |
| Autocomplete state | Local component state, not Zustand |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/chat/game-info-card.tsx` | Rich card for game profile inside bubble |
| `src/components/chat/mention-suggestions.tsx` | @mention autocomplete dropdown overlay |
| `src/components/chat/game-suggestions.tsx` | @game autocomplete dropdown overlay |
| `src/hooks/mock-data/mock-game-profiles.ts` | `GameProfile`-shaped mock data |
| `src/api/game.api.ts` | Mock `searchGameProfiles(query)` function |

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/chat.types.ts` | Add `GameInfoCard` type, optional `game_card` on `Message` |
| `src/components/chat/chat-input.tsx` | Add @mention + @game detection and autocomplete overlays |
| `src/components/chat/bubble/chat-message-bubble.tsx` | Render links, @mentions, game card |
| `app/chat/[id]/index.tsx` | Pass members list and game search fn to ChatInput |

---

## Implementation Order

### Step 1: Types + Mock Data

**`src/types/chat.types.ts`:**
- Add `GameInfoCard` type:
  ```ts
  export type GameInfoCard = {
    game_id: string;
    title: string;
    cover_url: string;
    developer: string;
    rating_score: string;
    tags: string[];
  };
  ```
- Add optional field to `Message`:
  ```ts
  game_card?: GameInfoCard | null;
  ```

**`src/hooks/mock-data/mock-game-profiles.ts`:**
- Create `MOCK_GAME_PROFILES: GameProfile[]` with 5-10 entries
- Fields: id, title, developer, cover_url, background_url, rating_score, rating_count, tags, description, reviews
- Reuse images and names from existing `mockFavoriteGames` where possible, but shaped as `GameProfile`

### Step 2: Game Search API

**`src/api/game.api.ts`:**
- `async searchGameProfiles(query: string): Promise<GameProfile[]>`
- Filter `MOCK_GAME_PROFILES` by title (case-insensitive includes)
- Simulate 200ms latency (consistent with mock pattern)

### Step 3: Link Detection in Bubble

**`src/components/chat/bubble/chat-message-bubble.tsx`:**
- Import `Linking` from react-native
- Add URL regex detection in message text render path
- Wrap matched URLs in `<Text>` with `onPress={() => Linking.openURL(url)}`
- Style: `color: "#4DA6FF"`, `textDecorationLine: "underline"`
- Add styles: `linkText`, `linkTextOwn`, `linkTextOther`

### Step 4: @Mention Autocomplete

**`src/components/chat/mention-suggestions.tsx`:**
- Props: `visible`, `members: GroupMember[]`, `query: string`, `onSelect: (member: GroupMember) => void`, `position: {top, left}`
- Filter members by username matching query (case-insensitive)
- Render as absolute-positioned overlay above keyboard
- Each row: avatar + username + role badge
- On tap: call `onSelect(member)`, parent inserts `@username` into TextInput

**`src/components/chat/chat-input.tsx`:**
- Track cursor position in text
- Detect `@` character + following chars (word boundary)
- If `@` detected AND conversation is group: show `MentionSuggestions`
- On select: insert `@username` at cursor position
- Track active `@` token for replacement

**`src/app/chat/[id]/index.tsx`:**
- Pass `conversation?.members` to `ChatInput` as `groupMembers` prop

### Step 5: @Game Autocomplete + Info Card

**`src/components/chat/game-suggestions.tsx`:**
- Props: `visible`, `query: string`, `onSelect: (game: GameInfoCard) => void`, `position: {top, left}`
- Calls `searchGameProfiles` as user types (debounced 300ms?)
- Each row: small cover image + title + developer
- On tap: `onSelect(game)`, parent replaces `@game <query>` text and stores selected game

**`src/components/chat/chat-input.tsx`:**
- Detect `@game ` prefix while typing
- Show `GameSuggestions` overlay
- On select: replace `@game <query>` text with empty string (or keep as reference)
- Add `selectedGameCard: GameInfoCard | null` state
- On send: attach `selectedGameCard` as `game_card` on message, clear state
- Pass game card through `onSend(text, attachments, replyToId, gameCard?)`

**`src/components/chat/game-info-card.tsx`:**
- Props: `game: GameInfoCard`, `maxWidth: number`, `onPress: () => void`
- Render: cover image (rounded top), title, developer, rating badge, tags row
- Tappable wrapper → `onPress` navigates to game profile

**`src/types/chat.types.ts` (API send + Message):**
- Update `Message` type to include optional `game_card`
- `sendMessage` API and `useConversation` hook must support passing `gameCard`

### Step 6: Wire in Screen

**`app/chat/[id]/index.tsx`:**
- Pass `groupMembers` (from `conversation?.members`) to `ChatInput`
- Handle `handleSend` to accept gameCard param
- Pass `router` for @mention + game card navigation

**`src/hooks/chat/useConversation.ts`:**
- Update `sendMessage` mutation to accept `gameCard?: GameInfoCard | null`
- Add `game_card` to optimistic message

---

## Non-Functional Requirements

- Styles: match existing chat bubble theme (colors, fonts, radii)
- @mention chip style: similar to `senderName` styling but with accent color background
- Game card max-width: same as `BUBBLE_MAX_WIDTH_RATIO` from constants
- No `any` anywhere
- Autocomplete overlays: position above keyboard, match existing glassmorphic style
- @mention only in group chats (pass `isGroup` check at screen level)

## Verification Checklist

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] URLs in message render blue + underline + tappable
- [ ] Typing `@` in group shows member autocomplete
- [ ] Typing `@` in DM does NOT show autocomplete
- [ ] Selecting member inserts `@username`
- [ ] Sent message with `@username` renders styled chip
- [ ] Tapping @mention navigates to user profile
- [ ] Typing `@game <query>` shows game search dropdown
- [ ] Selecting game attaches rich card to message
- [ ] Game card renders inside bubble with image + details
- [ ] Tapping game card navigates to game profile
- [ ] Non-@game text still works (plain messages)
- [ ] Link + @mention + @game can coexist in same message
- [ ] No regressions in existing chat features (reply, attachments, search, etc.)

---

## Commit Strategy

1. `feat(chat): add GameInfoCard type and GameProfile mock data`
2. `feat(chat): add mock game search API`
3. `feat(chat): add link detection and rendering in message bubbles`
4. `feat(chat): add @mention autocomplete and chip rendering`
5. `feat(chat): add @game autocomplete and game info card attachment`
6. `feat(chat): wire mention and game features in chat screen`

---

## Fixed Issues

| Issue | Fix |
|---|---|
| `google.com` not detected as link | `URL_REGEX` updated to match bare domains (`[\w.-]+\.[a-zA-Z]{2,6}`). `normalizeUrl()` prepends `https://` when opening |
| @game inline text autocomplete overengineered | Replaced with `GameSearchModal` (bottom sheet) + gamepad button in attachment menu. No inline detection |
| @mention dropdown delayed / wrong cursor position | Added `messageRef` for sync message access. Cursor computed via `selection.start + (text.length - prevLen)` in `handleChangeText` |
| MentionSuggestions dropdown overlaps input | Position: `top: -(inputHeight + 32)` above input |
| Attachment buttons visible after sending | `setShowAttachmentMenu(false)` in `handleSend` and `handleGameModalSelect` |
| Game button inline `onPress` without structure | Extracted `pickGame()` function matching `pickImage`/`pickVideo`/`pickDocument` pattern |

## New Requirements

### R1: Leave group → conversation hidden from chat list

When user leaves a group via any entry point, the conversation must disappear from the chat list screen.

**Implementation:**
- `chat.store.ts`: Add `hiddenConversationIds: string[]` + `hideConversation(id)` action
- `use-conversations.ts`: Filter out `hiddenConversationIds` from returned conversations
- `chat.api.ts`: `leaveGroup()` already removes current user from members array (mock)
- `app/chat/[id]/index.tsx`: Wire `onLeaveGroup` on `ChatOverflowMenu` → calls `leaveGroup(apiId)` + `store.hideConversation(id)` + `router.back()`
- `app/chat/index.tsx`: "Delete Group"/"Leave Group"/"Delete Chat" options in action sheet all call `store.hideConversation(id)`

**Verification:**
- [ ] Owner selects "Delete Group" → group disappears from list
- [ ] Member selects "Leave Group" → group disappears from list
- [ ] DM "Delete Chat" → conversation disappears from list
- [ ] After leaving/deleting, re-fetch shows conversation still absent

### R2: Long press conversation row shows action sheet

Long-pressing any entry in chat index triggers bottom sheet with contextual options.

**Implementation:**
- `ConversationRow.tsx`: Add `onLongPress` prop
- `ConversationActionsSheet.tsx` (new): Bottom sheet modal. Menu depends on conversation type:

| Scenario | Options |
|---|---|
| Group + User is OWNER | Open Chat, Mute Notifications, Report, **Delete Group** |
| Group + User is ADMIN/MEMBER | Open Chat, Mute Notifications, Report, **Leave Group** |
| DM | Open Chat, Mute Notifications, Report, **Delete Chat** |

- `app/chat/index.tsx`: State for `selectedConversation` + `showActions`. `handleDelete` checks owner status to decide label/behavior.

**Owner check:** Find member in `conversation.members` where `user_id === getCurrentUserId() && role === GroupRole.OWNER`.

**Verification:**
- [ ] Long press group convo (owner) → popover shows "Delete Group"
- [ ] Long press group convo (member) → popover shows "Leave Group"
- [ ] Long press DM → popover shows "Delete Chat"
- [ ] "Open Chat" navigates to `chat/[id]`
- [ ] Tap (no long press) still navigates to chat
- [ ] Delete/Leave calls `leaveGroup` API + `store.hideConversation`, list re-renders without it
- [ ] Mute/Report show "Coming soon" alert

## Updated Verification Checklist

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] URLs with and without protocol render as links
- [ ] `google.com` renders blue + underline + tappable
- [ ] Typing `@` in group shows member autocomplete
- [ ] Typing `@` in DM does NOT show autocomplete
- [ ] Selecting member inserts `@username`
- [ ] Sent message with `@username` renders styled chip
- [ ] Game button in attachment menu opens search modal
- [ ] Selecting game immediately sends game card (no text)
- [ ] Game card renders inside bubble with image + details
- [ ] Attachment buttons hide after pressing any option or sending
- [ ] Long press conversation row shows contextual action sheet
- [ ] Owner "Delete Group" removes from list
- [ ] Member "Leave Group" removes from list
- [ ] "Delete Chat" removes DM from list
- [ ] Leaving group via header overflow menu also removes from list
