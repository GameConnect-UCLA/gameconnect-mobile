#!/usr/bin/env node
/* global __dirname */
/**
 * Script: setup-refactor-structure.js
 * Genera la estructura de carpetas del refactor plan (v1.1)
 * Uso: node scripts/setup-refactor-structure.js
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');

const STRUCTURE = {
  // CORE
  'src/core/theme': ['index.ts'],
  'src/core/components': [
    'Button.tsx', 'Avatar.tsx', 'SearchBar.tsx', 'EmptyState.tsx',
    'LoadingSpinner.tsx', 'AppToast.tsx', 'ConfirmDialog.tsx',
    'DatePicker.tsx', 'AutocompleteDropdown.tsx'
  ],
  'src/core/hooks': ['useDebounce.ts', 'useConfirmDialog.ts', 'useNavigation.ts'],
  'src/core/lib': ['secure-store.ts', 'query-client.ts'],
  'src/core/store': ['auth.store.ts', 'user.store.ts', 'toast.store.ts'],
  'src/core/types': ['index.ts', 'auth.types.ts', 'user.types.ts', 'post.types.ts', 'game.types.ts'],
  'src/core/i18n': ['es.ts'],
  'src/core/utils': ['string.ts'],

  // FEATURES — AUTH
  'src/features/auth/api': ['auth.api.ts'],
  'src/features/auth/components': ['AuthCard.tsx', 'AuthBackground.tsx', 'DateOfBirthPicker.tsx'],
  'src/features/auth/hooks': [
    'index.ts', 'useLogin.ts', 'useSignup.ts', 'useSessionCheck.ts', 'useLogout.ts'
  ],
  'src/features/auth/screens': ['LoginScreen.tsx', 'SignUpScreen.tsx', 'ForgotScreen.tsx', 'RecoveryScreen.tsx'],
  'src/features/auth/types': ['auth.types.ts'],

  // FEATURES — FEED
  'src/features/feed/components': ['Feed.tsx', 'PostCard.tsx', 'PostActions.tsx', 'PostMedia.tsx'],
  'src/features/feed/hooks': ['useFeed.ts'],
  'src/features/feed/store': ['post.store.ts'],

  // FEATURES — POST
  'src/features/post/api': ['post.api.ts'],
  'src/features/post/components': ['PostDetailView.tsx', 'PostComments.tsx', 'CreatePostScreen.tsx'],
  'src/features/post/hooks': ['useCreatePost.ts'],
  'src/features/post/types': ['post.types.ts'],

  // FEATURES — CHAT (hooks consolidados v1.1)
  'src/features/chat/api': ['chat.api.ts'],
  'src/features/chat/components/common': [
    'ChatInput.tsx', 'MessageBubble.tsx', 'ImageAttachment.tsx',
    'ReplyPreview.tsx', 'ReplyBar.tsx', 'MediaPreview.tsx',
    'ScrollToBottomButton.tsx', 'GameInfoCard.tsx', 'ChatOverflowMenu.tsx'
  ],
  'src/features/chat/components/conversation-list': [
    'ConversationList.tsx', 'ConversationRow.tsx', 'ActiveAvatar.tsx',
    'NewConversationModal.tsx', 'ChatSearchBar.tsx'
  ],
  'src/features/chat/components/chat-room': [
    'ChatHeader.tsx', 'ChatMediaGrid.tsx',
    'ChatLinkList.tsx', 'MessageActionSheet.tsx'
  ],
  'src/features/chat/components/chat-info': [
    'ContactInfoCard.tsx', 'GroupMemberRow.tsx',
    'GroupRoleBadge.tsx', 'ConversationActionsSheet.tsx'
  ],
  'src/features/chat/components/new-group': ['NewGroupScreen.tsx'],
  'src/features/chat/hooks': [
    'index.ts',
    'useConversation.ts',      // query + send/delete optimistic + useChatInfo absorbido
    'useChatList.ts',          // consolidado: useConversations + useChatSearch
    'useChatInput.ts',         // extraído de chat-input.tsx
    'useAutocomplete.ts',      // lógica @mención / búsqueda juegos
    'useMediaDimensions.ts',   // migrado de bubble/use-media-dimensions
    'useScrollToBottom.ts',
    'useGroupMembers.ts'
  ],
  'src/features/chat/store': ['chat.store.ts'],  // reply, attachments, menciones state
  'src/features/chat/types': ['chat.types.ts'],

  // FEATURES — GAME
  'src/features/game/api': ['game.api.ts'],
  'src/features/game/components': [
    'GameProfileView.tsx', 'GameEditProfileView.tsx',
    'GameSearchModal.tsx', 'GameInfoCardDisplay.tsx'
  ],
  'src/features/game/hooks': ['useGameProfiles.ts'],
  'src/features/game/types': ['game.types.ts'],

  // FEATURES — PROFILE
  'src/features/profile/components': [
    'ProfileView.tsx', 'EditProfileView.tsx',
    'FavoriteGamesView.tsx', 'SettingsView.tsx', 'ChangePasswordView.tsx'
  ],
  'src/features/profile/hooks': ['useCurrentUser.ts'],

  // FEATURES — EXPLORE
  'src/features/explore/components': [
    'ExploreScreen.tsx', 'ExploreStickyHeader.tsx',
    'ExploreSectionCard.tsx', 'ExplorePlayersGrid.tsx'
  ],
  'src/features/explore/hooks': ['useExplore.ts'],
  'src/features/explore/utils': ['explore.utils.ts'],

  // FEATURES — NOTIFICATIONS
  'src/features/notifications/api': ['notifications.api.ts'],
  'src/features/notifications/components': [
    'NotificationsScreen.tsx', 'NotificationItem.tsx',
    'FollowRequestsCard.tsx', 'SectionHeader.tsx'
  ],
  'src/features/notifications/hooks': ['useNotifications.ts'],
  'src/features/notifications/types': ['notifications.types.ts'],

  // MOCKS
  'src/mocks': ['mock-chat.ts', 'mock-game.ts', 'mock-posts.ts', 'mock-user.ts', 'mock-users-list.ts'],
};

function createFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `// TODO: Migrate content to ${path.relative(BASE_DIR, filePath)}\n`, 'utf8');
    console.log(`  + ${path.relative(BASE_DIR, filePath)}`);
  } else {
    console.log(`  ~ ${path.relative(BASE_DIR, filePath)} (exists)`);
  }
}

function main() {
  console.log('Setup refactor structure (plan v1.1)\n');

  let created = 0;
  let existing = 0;

  for (const [dir, files] of Object.entries(STRUCTURE)) {
    const fullDir = path.join(BASE_DIR, dir);
    fs.mkdirSync(fullDir, { recursive: true });

    for (const file of files) {
      const filePath = path.join(fullDir, file);
      if (!fs.existsSync(filePath)) {
        createFile(filePath);
        created++;
      } else {
        existing++;
      }
    }
  }

  console.log(`\nDone: ${created} created, ${existing} existed`);
  console.log(`Dirs: ${Object.keys(STRUCTURE).length}`);
}

main();
