# GameConnect Mobile App - Complete Screen/Feature Map

## Navigation Structure

```
Root (app/_layout.tsx)
├── (tabs)              [Main authenticated app - 5 tabs at bottom]
├── (auth)              [Pre-authentication flow]
├── explore             [Search/discovery modal]
├── chat/               [Chat detail/group screens]
├── game/[id]/          [Game profile detail]
├── post/[id]           [Post detail/comments]
├── user/               [User profile detail]
└── +not-found          [404 fallback]
```

---

## 1. AUTHENTICATION SCREENS (Pre-Login)

Route: `app/(auth)/`  
Screen Type: Stack (no headers)

### 1.1 Login Screen
- **Route**: `/(auth)/login`
- **File**: `app/(auth)/login.tsx` → `src/features/auth/screens/LoginScreen.tsx`
- **Purpose**: User login with email/password
- **Features Shown**:
  - Email input field
  - Password input (with show/hide toggle)
  - Login button
  - Links to signup and forgot password screens
  - Form validation (required fields)
  - Loading state during authentication
- **Data Dependencies**:
  - `authApi.login(email, password)` → POST `/login`
- **Status**: Fully implemented

### 1.2 Sign Up Screen
- **Route**: `/(auth)/signup`
- **File**: `app/(auth)/signup.tsx` → `src/features/auth/screens/SignUpScreen.tsx`
- **Purpose**: User account creation
- **Features Shown**:
  - Email input
  - Username input
  - Password input (with show/hide toggle)
  - Confirm password input
  - Date of birth picker
  - Sign up button
  - Form validation
  - Loading state
  - Link back to login
- **Data Dependencies**:
  - `authApi.register(newUser)` → POST `/register`
- **Status**: Fully implemented

### 1.3 Forgot Password Screen
- **Route**: `/(auth)/forgot`
- **File**: `app/(auth)/forgot.tsx` → `src/features/auth/screens/ForgotScreen.tsx`
- **Purpose**: Request password reset link via email
- **Features Shown**:
  - Email input field
  - Submit button
  - Instructions text
  - Link back to login
- **Data Dependencies**:
  - `authApi.forgotPassword(email)` → POST `/forgot-password`
- **Status**: Fully implemented

### 1.4 Recovery/Reset Password Screen
- **Route**: `/(auth)/recovery`
- **File**: `app/(auth)/recovery.tsx` → `src/features/auth/screens/RecoveryScreen.tsx`
- **Purpose**: Reset password with new credentials (after email link click)
- **Features Shown**:
  - Password input (with show/hide)
  - Confirm password input (with show/hide)
  - Submit button
  - Form validation
  - Loading state
- **Data Dependencies**:
  - `authApi.resetPassword(password, confirmPassword)` → POST `/reset-password`
- **Status**: Fully implemented

---

## 2. MAIN TAB NAVIGATION (Authenticated App)

Route: `app/(tabs)/`  
Screen Type: Tab navigator (5 tabs at bottom with colored icons/labels)  
Background: Custom bgbody.png background image

### Tab Bar Configuration
- Active color: `#8A38F5` (purple)
- Inactive color: `#000000` (black)
- Background: `#D9D9D9` (light gray)
- Labels: Spanish (Inicio, Favoritos, Crear, Notificaciones, Perfil)

### 2.1 Home / Feed Tab
- **Route**: `/(tabs)/` (index)
- **File**: `app/(tabs)/index.tsx` → `src/features/feed/components/Feed.tsx`
- **Purpose**: Main scrollable social feed of user-generated posts/reviews
- **Features Shown**:
  - Animated collapsible header (hides on scroll)
  - FeedHeader component (search, filters)
  - List of PostCard components
  - Pull-to-refresh functionality
  - Infinite scroll / pagination (fetchNextPage)
  - "Reload hint" when scrolling up
  - Auto-scroll to top when new post added
  - Empty/loading states
  - Background image
- **Data Dependencies**:
  - `useFetchFeed()` → Infinite query to GET `/feed?limit=10&offset={offset}`
  - Paginated posts from TanStack Query
  - Local state: `usePostStore` (cached posts, lastAddedId)
- **Components Used**:
  - FeedHeader (search/filter bar)
  - PostCard (individual post display)
  - Animated FlatList (custom)
- **Status**: Fully implemented

### 2.2 Favorites Tab
- **Route**: `/(tabs)/favorites`
- **File**: `app/(tabs)/favorites.tsx` → `src/features/feed/components/FavoritesScreen.tsx`
- **Purpose**: Show bookmarked/favorited posts
- **Features Shown**:
  - List of user's favorite posts
  - PostCard components
  - Scrollable list
  - Pull-to-refresh
  - Empty state
- **Data Dependencies**:
  - Likely: GET `/posts/favorites` or `/user/favorites` (inferred)
  - Uses `usePostStore` for cached posts
- **Status**: Implemented (API call unclear, uses post store)

### 2.3 Create Post Tab
- **Route**: `/(tabs)/create`
- **File**: `app/(tabs)/create.tsx` → `src/features/post/components/CreatePostScreen.tsx`
- **Purpose**: Create new post or game review
- **Features Shown**:
  - Title input field
  - Description input (multi-line)
  - Tag/hashtag input with autocomplete
  - Game selection dropdown (with search) - for reviews
  - Review score/rating picker (1-5 stars) - if review type
  - Image picker (multiple photos)
  - Image preview gallery/carousel
  - Toggle between "post" and "review" modes
  - Form validation (title, description, tags, optional: rating)
  - Submit button with loading state
  - "Most recent game first" sorting for suggestions
  - Mock game titles for search/autocomplete
- **Data Dependencies**:
  - `useCreatePost()` mutation → POST `/posts`
  - Image upload: `mediaApi.uploadFile()` → Supabase Storage (per AGENTS.md)
  - Game search: local mock (`mockGameProfiles`) OR `searchGameProfiles()` (TODO: DB search)
  - Current user: `useGetMe()`
  - Post store: `usePostStore` to cache created post
- **Components Used**:
  - Image picker, carousel, form fields, auto-suggest dropdown
- **Status**: Fully implemented (with TODO: implement DB search for game reviews)
- **Known Issues**:
  - Game search uses mock data (TODO comment line 19: "TODO: implement db search for reviews")
  - No live database search for game titles yet

### 2.4 Notifications Tab
- **Route**: `/(tabs)/notifications`
- **File**: `app/(tabs)/notifications.tsx` → `src/features/notifications/components/NotificationsScreen.tsx`
- **Purpose**: View notifications and follow requests
- **Features Shown**:
  - Follow requests section (FollowRequestsCard)
    - Accept/reject buttons
    - User avatar, name, username
  - General notifications list (NotificationItem)
    - Like, comment, game request, group invitation types
    - User context info
    - Timestamps
    - Mark as read on tap
  - Pull-to-refresh
  - Loading, error, empty states
  - Real-time socket updates (useNotificationSocket)
  - Section headers
  - Background image
- **Data Dependencies**:
  - `useNotifications()` hook:
    - `fetchNotificationsApi()` → GET `/notifications`
    - `acceptFollowRequestApi(id)` → POST `/notifications/{id}/accept`
    - `rejectFollowRequestApi(id)` → POST `/notifications/{id}/reject`
  - Socket.io real-time: `useNotificationSocket()` for live updates
- **Components Used**:
  - SectionHeader, FollowRequestsCard, NotificationItem
- **Status**: Fully implemented

### 2.5 Profile Tab
- **Route**: `/(tabs)/profile`
- **File**: `app/(tabs)/profile.tsx` → `src/features/profile/components/ProfileView.tsx`
- **Purpose**: Current user's profile (self view)
- **Features Shown**:
  - Cover image (customizable)
  - Profile picture (avatar)
  - Display name + pronouns badge
  - Bio/bio sections
  - Follower/following counts
  - Favorite games list (carousel or expandable)
  - User's posts (PostCard list)
  - Edit button → opens edit profile modal
  - Settings button → opens settings screen
  - View all games button → opens favorite games screen
  - Add people button (console log placeholder)
  - Loading state (ActivityIndicator)
  - Error state with retry button
  - Background image
- **Data Dependencies**:
  - `useGetMe()` hook → GET `/users/me`
  - User store: `useUserStore`
  - Post store: `usePostStore` (filter posts by author)
- **Components Used**:
  - ProfileView (main component)
  - PostCard (user's posts)
  - Image, ScrollView, TouchableOpacity for navigation
- **Status**: Fully implemented
- **Navigation Actions**:
  - Edit button → `/user/edit-profile` (modal)
  - Settings button → `/user/settings`
  - View all games → `/user/favorite-games`
  - Back button → pops stack

---

## 3. MODAL / DETAIL SCREENS (Stack overlays)

### 3.1 Explore Screen (Modal overlay)
- **Route**: `/explore`
- **File**: `app/explore.tsx` → `src/features/explore/components/ExploreScreen.tsx`
- **Purpose**: Search, discovery, trending, featured players
- **Features Shown**:
  - Sticky search bar (animated, collapses on scroll)
  - Filter chips/tabs (TODO, GAMERS, POSTS, TRENDS, PLAYERS)
  - Trending hashtags (top 5, auto-calculated from posts)
  - Featured players grid (based on post count + likes)
  - Trend/hashtag cards (click → shows filtered posts)
  - Post cards (filtered by search query + active filter)
  - "Show more" button to load additional posts
  - Animated header that hides on scroll
  - Background image
- **Data Dependencies**:
  - Mock posts: `mockPosts` array
  - Query params: `q` (search term)
  - Calculated: trending tags, featured players derived from posts
  - No API calls yet (mock data only)
- **Components Used**:
  - ExplorePlayersGrid (featured players grid)
  - ExploreStickyHeader (search + filters)
  - ExploreSectionCard (trend cards)
  - PostCard (filtered results)
- **Status**: Fully implemented (mock data only, no API integration)
- **Known Issues**:
  - Uses mock posts only
  - No real search API call
  - "TODO" filter chip not functional
  - Featured player calculation is deterministic from mock data

### 3.2 Chat List Screen
- **Route**: `/chat`
- **File**: `app/chat/index.tsx` → `src/features/chat/screens/ChatListScreen.tsx`
- **Purpose**: List all user conversations and active users
- **Features Shown**:
  - Active users row (horizontal scroll, small avatars with online status)
  - Search bar (filters conversations by name/username)
  - Conversation rows
    - User avatar
    - Conversation name/participants
    - Last message preview (truncated)
    - Timestamp of last message
    - Unread badge (if any)
  - Long-press menu (mute, leave group, open, etc.)
  - Conversation actions sheet (modal)
  - "New conversation" modal (FAB button)
  - Pull-to-refresh
  - Loading states
  - Dividers between items
  - Background image
- **Data Dependencies**:
  - `useConversations()` hook:
    - `getConversations()` → GET `/chat/conversations`
    - Uses `useChatSocket()` for real-time updates
  - `useChatSearch()` hook (local search, TODO: API call)
    - Search query implemented but API call commented out (TODO)
  - Local state: `useChatStore` (hidden conversation IDs, muted status)
  - Mock active users: `ACTIVE_USERS` from mock-chat
- **Components Used**:
  - SearchBar, ConversationRow, ActiveAvatar
  - NewConversationModal (create group chat)
  - ConversationActionsSheet (context menu)
- **Status**: Fully implemented
- **Known Issues**:
  - Search only works locally (TODO: line useChatSearch.ts shows API call commented out)
  - Active users are hardcoded mocks
  - Mute/unmute not fully connected to backend (local state only)

### 3.3 Chat Detail / Room Screen
- **Route**: `/chat/[id]`
- **File**: `app/chat/[id]/index.tsx` → `src/features/chat/screens/ChatRoomScreen.tsx`
- **Purpose**: View conversation messages and send/receive messages
- **Features Shown**:
  - Chat header (conversation name, participants, options menu)
  - Message list (grouped by date)
    - Message bubbles (left = other, right = current user)
    - Avatar + name for group chats
    - Timestamps
    - Message status indicator (sent, delivered, read)
    - Long-press to reply or delete
    - Swipe right to quick-reply
  - Media messages (images, video, etc.)
  - Emoji reactions (if implemented)
  - Game info cards (inline game links/previews)
  - Chat input box
    - Text input
    - Image/media attachment button
    - Mention suggestions (@username autocomplete)
    - Game search modal
    - Send button
    - Reply preview bar (if replying to message)
  - Scroll-to-bottom button (when new messages arrive)
  - Keyboard handling (avoids overlap)
  - Loading state for messages
- **Data Dependencies**:
  - `useConversation(conversationId)` hook:
    - `getConversation(id)` → GET `/chat/conversations/{id}`
    - Uses `useChatSocket()` for real-time message updates
  - Send message: `sendMessage()` → POST `/chat/conversations/send`
  - Delete message: `deleteMessage()` → POST `/chat/conversations/delete-message`
  - Reply message: included in sendMessage (replyToId param)
  - Message reactions: API inferred (likely POST `/chat/messages/{id}/react`)
  - Game search: `searchGameProfiles()` → GET `/games/search`
  - Mentions: `useAutocomplete()` (likely fetches users for @mention)
- **Components Used**:
  - ChatHeader, ChatInput, MessageBubble, MessageActionSheet, ReplyPreview
  - MentionSuggestions, GameSearchModal, GameInfoCard
  - ScrollToBottomButton, ChatMediaGrid
- **Status**: Fully implemented (with some incomplete/TODO features)

### 3.4 Chat Info Screen
- **Route**: `/chat/[id]/info`
- **File**: `app/chat/[id]/info.tsx` → `src/features/chat/screens/ChatInfoScreen.tsx`
- **Purpose**: View conversation settings, members, media, and links shared
- **Features Shown**:
  - Group name (editable if admin/owner)
  - Group description (editable if admin/owner)
  - Group image (editable if admin/owner)
  - Members list
    - Avatar, name, role badge (admin, moderator, member)
    - Remove button (if admin)
    - Long-press for member actions
  - Add members button
  - Leave group button
  - Media gallery (images/files shared in chat)
  - Links section (URLs shared in conversation)
  - Clear history button
  - Notifications settings (mute toggle)
  - Loading states
- **Data Dependencies**:
  - `useChatInfo(conversationId)` hook:
    - `getConversation(id)` → GET `/chat/conversations/{id}` (includes messages with media)
    - `getGroupMembers(id)` → inferred GET `/chat/conversations/{id}/members`
  - Member actions:
    - `removeGroupMember(conversationId, userId)` → DELETE/POST
    - `updateGroupRole(conversationId, userId, role)` → PATCH
  - Group settings:
    - `updateGroup(groupId, name, description, image)` → PATCH `/chat/conversations/{id}`
  - Clear history: `clearChatHistory(conversationId)` → POST `/chat/conversations/clear`
- **Components Used**:
  - GroupMemberRow, GroupRoleBadge, ChatMediaGrid, ChatLinkList
  - ConversationActionsSheet
- **Status**: Fully implemented (856 lines - substantial)
- **Known Issues**:
  - Some member action callbacks may not be complete
  - Media parsing from message attachments

### 3.5 New Group Chat Screen
- **Route**: `/chat/newgroup`
- **File**: `app/chat/newgroup.tsx` → `src/features/chat/screens/NewGroupScreen.tsx`
- **Purpose**: Create new group conversation
- **Features Shown**:
  - Group name input field
  - Member search/selection (autocomplete dropdown)
    - Shows avatars, names, usernames
    - Add/remove button per user
  - Selected members chips/tags
    - Avatar + name display
    - Remove (X) button per member
  - Create group button (enabled when name + members chosen)
  - Form validation
  - Loading state on submit
  - Cancel/back button
- **Data Dependencies**:
  - User autocomplete: `useAutocomplete()` or `useGroupMembers()`
    - Inferred: `searchUsers(query)` → GET `/users/search?q={query}` (likely, but may use mock)
  - Create group: `createGroup(name, memberIds)` → POST `/chat/conversations/create-group`
- **Components Used**:
  - Search input, member selection chips, TextInput
- **Status**: Fully implemented

### 3.6 Game Profile Screen
- **Route**: `/game/[id]`
- **File**: `app/game/[id]/index.tsx` → `src/features/game/components/GameProfileView.tsx`
- **Purpose**: View game details, reviews, community posts
- **Features Shown**:
  - Game cover image
  - Game title, description
  - Genre tags
  - Release date
  - Developer/publisher info
  - User ratings (average + distribution)
  - Aggregate score / our score
  - Screenshots carousel (if available)
  - User reviews list (PostCard)
    - Sort by date/rating
  - Related games / recommendations
  - Add to favorites button
  - Edit button (if game owner)
- **Data Dependencies**:
  - `useGameProfile(gameId)` hook:
    - `fetchGameProfileById(id)` → GET `/games/{id}`
  - Related posts: inferred from post store or GET `/games/{id}/posts`
  - Ratings: aggregated from posts tagged with game
- **Components Used**:
  - GameProfileView (main), PostCard (reviews)
  - Image carousel, rating display
- **Status**: Fully implemented
- **Navigation Actions**:
  - Edit button → `/game/[id]/settings` (modal)

### 3.7 Game Settings / Edit Screen
- **Route**: `/game/[id]/settings`
- **File**: `app/game/[id]/settings.tsx` → `src/features/game/components/GameEditProfileView.tsx`
- **Purpose**: Edit game profile (if owner/admin)
- **Features Shown**:
  - Game name input (text field)
  - Description input (multiline)
  - Genre tags input
  - Cover image picker
  - Release date picker
  - Developer/publisher inputs
  - Save button with loading state
  - Cancel/back button
- **Data Dependencies**:
  - Fetch game: `useGameProfile(gameId)` → GET `/games/{id}`
  - Save changes: inferred mutation → PATCH `/games/{id}`
  - Image upload: `mediaApi.uploadFile()` (if cover changed)
- **Status**: Fully implemented (but minimal - 195 lines)

### 3.8 Post Detail Screen
- **Route**: `/post/[id]`
- **File**: `app/post/[id].tsx` → `src/features/post/components/PostDetailView.tsx`
- **Purpose**: View full post/review with comments
- **Features Shown**:
  - Post header (author, date, edit/delete menu)
  - Post title, description, rating (if review)
  - Image gallery (paginated or carousel)
    - imageIndex route param determines initial image
  - Likes count + like button
  - Comments section
    - Comment list with threaded replies (if implemented)
    - Comment input box
    - User avatars, names, timestamps
  - Shares count / share button
  - Related/recommended posts
  - Game card embed (if tagged)
- **Data Dependencies**:
  - Post data: `usePostStore` (cached post by ID)
    - Matches post.id with route param id
  - Comments: inferred GET `/posts/{id}/comments`
  - Like: inferred POST `/posts/{id}/like`
  - Comment create: inferred POST `/posts/{id}/comments`
- **Components Used**:
  - PostDetailView (main), PostComments (comment list)
  - Image carousel, comment input
- **Status**: Fully implemented (uses local post store, so comments may be limited)
- **Known Issues**:
  - Post not found error if ID not in store
  - Comments may not persist (local state only)

### 3.9 User Profile Detail Screen
- **Route**: `/user/[id]`
- **File**: `app/user/[id].tsx` → `src/features/profile/components/ProfileView.tsx`
- **Purpose**: View another user's profile (public view)
- **Features Shown**:
  - Similar to current profile tab, but:
    - No edit button
    - Follow/unfollow button instead
    - View only (can't edit)
  - Cover, avatar, name, bio, pronouns
  - Favorite games
  - User's posts
  - Back button
  - Settings button (if self)
  - Add people button (if other user)
- **Data Dependencies**:
  - Check if viewing own profile: compare route param `id` with `useUserStore().user.id`
  - If self: `useGetMe()` → GET `/users/me`
  - If other: `useGetUser(id)` → GET `/users/{id}`
  - Posts: filtered from `usePostStore` by username
  - Follow action: inferred POST `/users/{id}/follow`
- **Status**: Fully implemented (conditional logic for self vs other)
- **Navigation Actions**:
  - Edit button (self only) → `/user/edit-profile`
  - Settings button (self only) → `/user/settings`
  - Favorite games button → `/user/favorite-games`
  - Back → pops stack

### 3.10 Edit Profile Screen (Modal)
- **Route**: `/user/edit-profile`
- **File**: `app/user/edit-profile.tsx` → `src/features/profile/components/EditProfileView.tsx`
- **Purpose**: Edit current user's profile
- **Features Shown**:
  - Profile picture (with image picker)
  - Cover image (with image picker)
  - Display name input (text field)
  - Username input (text field, with validation)
  - Bio input (multiline text)
  - Pronouns input (text field or dropdown)
  - Save button (with loading state)
  - Back/cancel button
  - Form validation (displayName, username)
  - Image preview before upload
  - Upload progress (if implemented)
- **Data Dependencies**:
  - Fetch user: `useGetMe()` → GET `/users/me`
  - Image upload: `mediaApi.uploadFile()` → Supabase Storage
  - Update profile: `useProfile().updateProfile()` → PATCH `/users/profile`
  - Payload fields: displayName, username, bio, pronouns, profilePic, coverPic
- **Components Used**:
  - EditProfileView (main), Image picker, TextInput
- **Status**: Fully implemented (with image upload integration)

### 3.11 Settings Screen
- **Route**: `/user/settings`
- **File**: `app/user/settings.tsx` → `src/features/profile/components/SettingsView.tsx`
- **Purpose**: User settings and account options
- **Features Shown**:
  - Account section
    - Change password button → `/user/change-password`
    - Two-factor authentication toggle (if implemented)
  - Privacy section
    - Account visibility (public/private toggle)
    - Block list management
    - Block/unblock user modal
  - Notifications section
    - Notification preferences toggles
  - About section
    - App version
    - Terms of service link
    - Privacy policy link
  - Logout button
  - Delete account button (warning alert)
- **Data Dependencies**:
  - Fetch settings: inferred GET `/users/settings` or included in /users/me
  - Update settings: inferred PATCH `/users/settings`
  - Change password: → navigate to `/user/change-password`
  - Block user: inferred POST `/users/block`
  - Logout: `authApi` or auth store
- **Components Used**:
  - SettingsView (main - 315 lines)
  - Various toggle switches, buttons, sections
- **Status**: Fully implemented (315 lines, substantial)
- **Navigation Actions**:
  - Change password → `/user/change-password`

### 3.12 Change Password Screen
- **Route**: `/user/change-password`
- **File**: `app/user/change-password.tsx` → `src/features/profile/components/ChangePasswordView.tsx`
- **Purpose**: Change user password
- **Features Shown**:
  - Current password input (masked)
  - New password input (masked, with show/hide toggle)
  - Confirm password input (masked, with show/hide toggle)
  - Password strength indicator (optional)
  - Password requirements text (minimum 8 characters)
  - Save button (with loading state)
  - Cancel/back button
  - Form validation (all fields required, passwords match)
  - Error message if current password incorrect
- **Data Dependencies**:
  - Change password: `authApi.changePassword(currentPassword, newPassword)` → POST `/change-password`
  - Payload: { currentPassword, newPassword }
- **Status**: Fully implemented (201 lines)

### 3.13 Favorite Games Screen
- **Route**: `/user/favorite-games`
- **File**: `app/user/favorite-games.tsx` → `src/features/profile/components/FavoriteGamesView.tsx`
- **Purpose**: Manage user's favorite/favorite games list
- **Features Shown**:
  - Search bar (filter games by name)
  - Games grid or list
    - Game cover image
    - Game title
    - Remove button (X icon)
  - Add game button / "+" FAB
  - Pull-to-refresh
  - Empty state (no favorites yet)
  - Loading state
- **Data Dependencies**:
  - Fetch user's games: inferred GET `/users/me/games` or included in profile
  - Or: GET `/games` (all games) filtered to user's selections
  - Add game: inferred POST `/users/me/games/{gameId}`
  - Remove game: inferred DELETE `/users/me/games/{gameId}`
  - Game search: `searchGameProfiles(query)` → GET `/games/search?q={query}`
- **Status**: Implemented (157 lines)

---

## 4. REUSABLE COMPONENTS (Non-Screen)

Located in `src/features/[feature]/components/` (not in `screens/` subdirectory)

### Feed Components
- `FeedHeader.tsx` - Search/filter bar for feed
- `Feed.tsx` - Main feed component (see 2.1)
- `FavoritesScreen.tsx` - Favorites list (see 2.2)
- `PostCard.tsx` - Individual post display (442 lines)

### Chat Components (23 sub-components)
- `ChatInput.tsx` - Message input box with attachments (299 lines)
- `MessageBubble.tsx` - Single message bubble (525 lines)
- `GameSearchModal.tsx` - Game picker modal (261 lines)
- `ReplyBar.tsx` - Reply-to indicator
- `ReplyPreview.tsx` - Preview of message being replied to
- `MentionSuggestions.tsx` - @mention autocomplete dropdown
- `MediaPreview.tsx` - Media attachment preview
- `ImageAttachment.tsx` - Image in chat
- `GameInfoCard.tsx` - Embedded game card
- `ChatHeader.tsx` - Room header with title/options
- `ChatMediaGrid.tsx` - Grid of media in conversation
- `ChatLinkList.tsx` - List of links shared
- `ScrollToBottomButton.tsx` - FAB to jump to latest message
- `ChatOverflowMenu.tsx` - More options menu (156 lines)
- `ChatSearchBar.tsx` - Search within chat (180 lines)
- `ConversationRow.tsx` - Single conversation item in list (168 lines)
- `ConversationActionsSheet.tsx` - Long-press context menu (140 lines)
- `ActiveAvatar.tsx` - Online user avatar
- `NewConversationModal.tsx` - Create 1-on-1/group (265 lines)
- `GroupMemberRow.tsx` - Member in group info
- `GroupRoleBadge.tsx` - Admin/mod badge
- `MessageActionSheet.tsx` - Message menu (copy, delete, etc.)

### Explore Components
- `ExploreScreen.tsx` - Main explore screen (see 3.1)
- `ExplorePlayersGrid.tsx` - Featured players grid
- `ExploreStickyHeader.tsx` - Search + filter header
- `ExploreSectionCard.tsx` - Trend card display

### Game Components
- `GameProfileView.tsx` - Game profile display (259 lines, see 3.6)
- `GameEditProfileView.tsx` - Game edit form (195 lines, see 3.7)

### Profile Components
- `ProfileView.tsx` - User profile display (439 lines, see 2.5/3.9)
- `EditProfileView.tsx` - Edit profile form (244 lines, see 3.10)
- `SettingsView.tsx` - Settings screen (315 lines, see 3.11)
- `ChangePasswordView.tsx` - Password change (201 lines, see 3.12)
- `FavoriteGamesView.tsx` - Games management (157 lines, see 3.13)

### Post Components
- `CreatePostScreen.tsx` - Create post/review (923 lines, see 2.3)
- `PostDetailView.tsx` - Post detail (220 lines, see 3.8)
- `PostComments.tsx` - Comments list

### Notifications Components
- `NotificationsScreen.tsx` - Notifications view (227 lines, see 2.4)
- `NotificationItem.tsx` - Single notification (345 lines)
- `FollowRequestsCard.tsx` - Follow requests section (190 lines)
- `SectionHeader.tsx` - Section title header

### Auth Components
- `AuthBackground.tsx` - Gradient/image background for auth screens
- `AuthCard.tsx` - Centered card wrapper for auth forms
- `DateOfBirthPicker.tsx` - Date picker for signup

---

## 5. API ENDPOINTS SUMMARY

All endpoints assume base URL set in `src/core/api/client.ts`

### Authentication
- POST `/login` - Login with email/password
- POST `/register` - Create new account
- POST `/refresh` - Refresh JWT token
- POST `/forgot-password` - Request password reset
- POST `/reset-password` - Reset password with token
- POST `/change-password` - Change password (authenticated)

### Users / Profiles
- GET `/users/me` - Current user profile
- GET `/users/{id}` - User profile by ID
- PATCH `/users/profile` - Update current user profile
- GET `/users/search?q={query}` - Search users (TODO: mobile side)
- GET `/users/me/games` - User's favorite games (inferred)
- POST `/users/{id}/follow` - Follow user (inferred)
- POST `/users/block` - Block user (inferred)

### Posts / Feed
- GET `/feed?limit={limit}&offset={offset}` - Paginated feed
- GET `/posts` - All posts
- GET `/posts/{id}` - Single post
- POST `/posts` - Create post/review
- GET `/posts/{id}/comments` - Post comments (inferred)
- POST `/posts/{id}/comments` - Add comment (inferred)
- POST `/posts/{id}/like` - Like post (inferred)
- GET `/posts/favorites` - User's favorites (inferred)

### Games
- GET `/games` - All games
- GET `/games/{id}` - Game profile
- GET `/games/search?q={query}` - Search games
- PATCH `/games/{id}` - Update game profile (inferred)

### Chat
- GET `/chat/conversations` - List conversations
- GET `/chat/conversations/{id}` - Single conversation
- POST `/chat/conversations/send` - Send message
- POST `/chat/conversations/create-group` - Create group (inferred)
- POST `/chat/conversations/delete-message` - Delete message
- POST `/chat/conversations/clear` - Clear history
- GET `/chat/conversations/{id}/members` - Group members (inferred)
- DELETE `/chat/conversations/{id}/members/{userId}` - Remove member (inferred)
- PATCH `/chat/conversations/{id}` - Update group info (inferred)

### Notifications
- GET `/notifications` - List notifications
- POST `/notifications/{id}/accept` - Accept follow request
- POST `/notifications/{id}/reject` - Reject follow request
- POST `/notifications/{id}/accept-invite` - Accept group invite (inferred)
- POST `/notifications/{id}/reject-invite` - Reject group invite (inferred)

### Media
- POST (Supabase Storage) - Upload file to `/uploads`

### WebSocket / Real-time
- Socket.io connection (configured in `src/lib/`)
- Events: message, notification, group update, etc.

---

## 6. KNOWN TODOs AND INCOMPLETE FEATURES

### 1. **Chat Search**
- Location: `src/features/chat/hooks/useChatSearch.ts`
- Issue: API call commented out (returns empty array)
- TODO: Replace mock search with GET `/users/search?q={query}`

### 2. **Game Search in Create Post**
- Location: `src/features/post/components/CreatePostScreen.tsx` (line 19)
- Issue: Uses mock games only for review creation
- TODO: Implement database search for game reviews (integrate `searchGameProfiles()`)

### 3. **Explore Filter - "TODO" Chip**
- Location: `src/features/explore/utils/explore.utils.ts`
- Issue: Filter labeled "TODO" - not functional
- Status: Mock filter, no API implementation

### 4. **Comments Persistence**
- Issue: Post detail comments may only be local (no backend sync)
- Inferred: Comments need API integration

### 5. **Active Users Mocks**
- Location: Chat List Screen
- Issue: Active users are hardcoded mocks (ACTIVE_USERS)
- TODO: Fetch from GET `/users/online` or similar

### 6. **Post Likes/Reactions**
- Issue: Like functionality inferred but implementation unclear
- TODO: Confirm POST `/posts/{id}/like` integration

### 7. **User Follow Button**
- Location: Profile screens (public view)
- Issue: Follow button exists but backend integration unclear
- TODO: Confirm POST `/users/{id}/follow` integration

### 8. **Block List Management**
- Location: SettingsView
- Issue: UI exists but API integration unclear
- TODO: Confirm GET/POST `/users/block` endpoints

### 9. **Settings Persistence**
- Location: SettingsView (all toggles)
- Issue: Some toggles (notifications, privacy) may not persist
- TODO: Confirm PATCH `/users/settings` integration

### 10. **Favorite Games Management**
- Location: FavoriteGamesView
- Issue: Add/remove game API calls not explicitly visible
- TODO: Confirm POST/DELETE `/users/me/games/{gameId}`

---

## 7. SCREEN HIERARCHY OVERVIEW

```
Root Layout
│
├─ Index (splash/auth check)
│
├─ (Auth) - Pre-authentication stack
│  ├─ Login
│  ├─ SignUp
│  ├─ Forgot (password reset request)
│  └─ Recovery (password reset confirmation)
│
├─ (Tabs) - Main authenticated app (bottom tabs)
│  ├─ index (Home/Feed)
│  ├─ favorites (Favorite posts)
│  ├─ create (Post/Review creation)
│  ├─ notifications (Notifications + follow requests)
│  └─ profile (Current user profile)
│
├─ explore (Discovery/search modal)
│
├─ chat/ - Messaging stack
│  ├─ index (Conversation list)
│  ├─ newgroup (Create group)
│  ├─ [id]/ (Conversation detail)
│  │  ├─ index (Chat room)
│  │  └─ info (Group/conversation info)
│
├─ game/[id]/ - Game detail stack
│  ├─ index (Game profile)
│  └─ settings (Game edit)
│
├─ post/[id] (Post detail with comments)
│
├─ user/ - User profile stack
│  ├─ [id] (Other user's public profile)
│  ├─ edit-profile (Modal: Edit current user)
│  ├─ settings (Settings page)
│  ├─ change-password (Password change)
│  └─ favorite-games (Game management)
│
└─ +not-found (404 catch-all)
```

---

## 8. DATA FLOW SUMMARY

### Authentication Flow
1. Index screen checks `useSessionCheck()` hook
2. Routes to `/(auth)/login` or `/(tabs)` based on token presence
3. Login/SignUp → `authApi.login/register()` → stores JWT token
4. Token auto-refreshed via `refresh` hook on app init

### Post/Feed Flow
1. Home tab loads infinite feed: `useFetchFeed()` (paginated)
2. Posts cached in `usePostStore` (Zustand)
3. Create post: `useCreatePost()` → uploads images → creates post → updates store
4. Post detail: retrieves from store by ID

### Chat Flow
1. Chat list loads conversations: `useConversations()` → stores in `useChatStore`
2. Socket.io listener for real-time updates: `useChatSocket()`
3. Enter chat room: `useConversation(id)` → loads messages
4. Send message: `sendMessage()` → broadcasts via socket → adds to local list
5. Long-press message → delete/react options

### Profile Flow
1. Load user: `useGetMe()` (self) or `useGetUser(id)` (other)
2. Edit: `useProfile().updateProfile()` → patches user record + uploads images
3. Settings: various toggles → inferred PATCH `/users/settings`

### Notifications Flow
1. Load notifications: `useNotifications()` → GET `/notifications`
2. Socket listener: `useNotificationSocket()` → real-time updates
3. Accept/reject follow request → POST `/notifications/{id}/accept/reject`
4. Mark as read on tap (inferred)

---

## 9. STYLE & THEME

- **Design tokens** in `src/core/theme/`: Colors, Spacing, Radii, Typography
- **Primary color**: #8A38F5 (purple)
- **Secondary colors**: #033563 (dark blue), #9b1999 (magenta)
- **Background**: Custom bgbody.png (repeating pattern)
- **Tab bar**: #D9D9D9 (light gray)
- **Language**: Spanish (UI labels, placeholders, error messages)

---

## 10. STATS

- **Total screens/routes**: 22
- **Total feature folders**: 8 (auth, chat, explore, feed, game, notifications, post, profile)
- **Total components**: 47+ reusable components
- **Total lines of code** (screens/components): ~10,647
- **Largest screen**: CreatePostScreen (923 lines)
- **Largest component**: ChatInfoScreen (856 lines)

---

## FILE STRUCTURE REFERENCE

```
gameconnect-mobile/
├── app/
│   ├── _layout.tsx              [Root layout]
│   ├── index.tsx                [Auth check/splash]
│   ├── +not-found.tsx           [404]
│   ├── explore.tsx              [Re-export]
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx            [Re-export]
│   │   ├── signup.tsx           [Re-export]
│   │   ├── forgot.tsx           [Re-export]
│   │   └── recovery.tsx         [Re-export]
│   ├── (tabs)/
│   │   ├── _layout.tsx          [Tab navigator config]
│   │   ├── index.tsx            [Re-export Feed]
│   │   ├── favorites.tsx        [Re-export FavoritesScreen]
│   │   ├── create.tsx           [Re-export CreatePostScreen]
│   │   ├── notifications.tsx    [Re-export NotificationsScreen]
│   │   └── profile.tsx          [Re-export ProfileView]
│   ├── chat/
│   │   ├── index.tsx            [Re-export ChatListScreen]
│   │   ├── newgroup.tsx         [Re-export NewGroupScreen]
│   │   └── [id]/
│   │       ├── index.tsx        [Re-export ChatRoomScreen]
│   │       └── info.tsx         [Re-export ChatInfoScreen]
│   ├── game/[id]/
│   │   ├── _layout.tsx          [Game detail layout]
│   │   ├── index.tsx            [Re-export GameProfileView]
│   │   └── settings.tsx         [Re-export GameEditProfileView]
│   ├── post/
│   │   └── [id].tsx             [Re-export PostDetailView]
│   └── user/
│       ├── _layout.tsx          [User detail layout]
│       ├── [id].tsx             [Re-export ProfileView (public)]
│       ├── edit-profile.tsx     [Re-export EditProfileView]
│       ├── settings.tsx         [Re-export SettingsView]
│       ├── change-password.tsx  [Re-export ChangePasswordView]
│       └── favorite-games.tsx   [Re-export FavoriteGamesView]
│
└── src/features/
    ├── auth/
    │   ├── api/
    │   │   └── auth.api.ts
    │   ├── components/
    │   │   ├── AuthBackground.tsx
    │   │   ├── AuthCard.tsx
    │   │   └── DateOfBirthPicker.tsx
    │   ├── hooks/
    │   │   ├── useLogin.ts
    │   │   ├── useSignup.ts
    │   │   ├── useSessionCheck.ts
    │   │   └── index.ts
    │   ├── screens/
    │   │   ├── LoginScreen.tsx
    │   │   ├── SignUpScreen.tsx
    │   │   ├── ForgotScreen.tsx
    │   │   └── RecoveryScreen.tsx
    │   ├── store/
    │   ├── types/
    │   │   └── auth.types.ts
    │   └── [other]
    │
    ├── chat/
    │   ├── api/
    │   │   └── chat.api.ts
    │   ├── components/
    │   │   ├── ChatInput.tsx
    │   │   ├── MessageBubble.tsx
    │   │   ├── [20+ other components]
    │   ├── hooks/
    │   │   ├── useChatSocket.ts
    │   │   ├── useConversation.ts
    │   │   ├── useConversations.ts
    │   │   ├── [5+ other hooks]
    │   │   └── index.ts
    │   ├── screens/
    │   │   ├── ChatListScreen.tsx
    │   │   ├── ChatRoomScreen.tsx
    │   │   ├── ChatInfoScreen.tsx
    │   │   └── NewGroupScreen.tsx
    │   ├── store/
    │   │   └── chat.store.ts
    │   └── types/
    │       └── chat.types.ts
    │
    ├── explore/
    │   ├── components/
    │   │   ├── ExploreScreen.tsx
    │   │   ├── ExplorePlayersGrid.tsx
    │   │   ├── ExploreStickyHeader.tsx
    │   │   └── ExploreSectionCard.tsx
    │   ├── hooks/
    │   ├── utils/
    │   │   └── explore.utils.ts
    │   └── [other]
    │
    ├── feed/
    │   ├── components/
    │   │   ├── Feed.tsx
    │   │   ├── FavoritesScreen.tsx
    │   │   ├── FeedHeader.tsx
    │   │   └── PostCard.tsx
    │   ├── hooks/
    │   │   └── useFetchFeed.ts
    │   ├── store/
    │   │   └── post.store.ts
    │   └── [other]
    │
    ├── game/
    │   ├── api/
    │   │   └── game.api.ts
    │   ├── components/
    │   │   ├── GameProfileView.tsx
    │   │   └── GameEditProfileView.tsx
    │   ├── hooks/
    │   │   └── useGameProfiles.ts
    │   ├── types/
    │   │   └── game.types.ts
    │   └── [other]
    │
    ├── notifications/
    │   ├── api/
    │   │   └── notifications.api.ts
    │   ├── components/
    │   │   ├── NotificationsScreen.tsx
    │   │   ├── NotificationItem.tsx
    │   │   ├── FollowRequestsCard.tsx
    │   │   └── SectionHeader.tsx
    │   ├── hooks/
    │   │   ├── useNotifications.ts
    │   │   └── useNotificationSocket.ts
    │   ├── types/
    │   │   └── notifications.types.ts
    │   └── [other]
    │
    ├── post/
    │   ├── api/
    │   │   └── post.api.ts
    │   ├── components/
    │   │   ├── CreatePostScreen.tsx
    │   │   ├── PostDetailView.tsx
    │   │   └── PostComments.tsx
    │   ├── hooks/
    │   │   └── useCreatePost.ts
    │   ├── types/
    │   │   └── post.types.ts
    │   └── [other]
    │
    └── profile/
        ├── api/
        │   └── profile.api.ts
        ├── components/
        │   ├── ProfileView.tsx
        │   ├── EditProfileView.tsx
        │   ├── SettingsView.tsx
        │   ├── ChangePasswordView.tsx
        │   └── FavoriteGamesView.tsx
        ├── hooks/
        │   ├── useGetMe.ts
        │   ├── useGetUser.ts
        │   ├── useUpdateProfile.ts
        │   └── [other]
        ├── types/
        │   └── user.types.ts
        └── [other]
```

