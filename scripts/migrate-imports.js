#!/usr/bin/env node
/**
 * Script: migrate-imports.js
 * Actualiza imports de archivos viejos a nueva estructura feature-based (plan v1.1)
 * Uso: node scripts/migrate-imports.js <archivo-o-directorio>
 */

const fs = require('fs');
const path = require('path');

const IMPORT_MAP = {
  // ── CORE ──────────────────────────────────────────────────────────
  '@/src/components/ui/app-toast': '@/src/core/components/AppToast',
  '@/src/components/ui/SearchBar': '@/src/core/components/SearchBar',
  '@/src/hooks/useDebounce': '@/src/core/hooks/useDebounce',
  '@/src/lib/secure-store': '@/src/core/lib/secure-store',

  // ── STORE ─────────────────────────────────────────────────────────
  '@/src/store/auth.store': '@/src/core/store/auth.store',
  '@/src/store/user.store': '@/src/core/store/user.store',
  '@/src/store/toast.store': '@/src/core/store/toast.store',
  '@/src/store/chat.store': '@/src/features/chat/store/chat.store',
  '@/src/store/post.store': '@/src/features/feed/store/post.store',

  // ── TYPES ─────────────────────────────────────────────────────────
  '@/src/types/auth.types': '@/src/core/types/auth.types',
  '@/src/types/user.types': '@/src/core/types/user.types',
  '@/src/types/post.types': '@/src/core/types/post.types',
  '@/src/types/game.types': '@/src/core/types/game.types',
  '@/src/types/chat.types': '@/src/features/chat/types/chat.types',

  // ── API ───────────────────────────────────────────────────────────
  '@/src/api/chat.api': '@/src/features/chat/api/chat.api',
  '@/src/api/auth.api': '@/src/features/auth/api/auth.api',
  '@/src/api/game.api': '@/src/features/game/api/game.api',
  '@/src/api/notifications': '@/src/features/notifications/api/notifications.api',

  // ── AUTH HOOKS ────────────────────────────────────────────────────
  '@/src/hooks/useAuth': '@/src/features/auth/hooks',

  // ── NOTIFICATIONS HOOKS ───────────────────────────────────────────
  '@/src/hooks/useNotifications': '@/src/features/notifications/hooks/useNotifications',

  // ── CHAT HOOKS (consolidados v1.1) ────────────────────────────────
  '@/src/hooks/chat/useConversation': '@/src/features/chat/hooks/useConversation',
  '@/src/hooks/chat/use-conversations': '@/src/features/chat/hooks/useChatList',
  '@/src/hooks/chat/useChatSearch': '@/src/features/chat/hooks/useChatList',
  '@/src/hooks/chat/use-chat-info': '@/src/features/chat/hooks/useConversation',
  '@/src/hooks/chat/use-group-members': '@/src/features/chat/hooks/useGroupMembers',
  '@/src/hooks/chat/use-scroll-to-bottom': '@/src/features/chat/hooks/useScrollToBottom',

  // ── MOCK DATA ─────────────────────────────────────────────────────
  '@/src/hooks/mock-data/mock-chat': '@/src/mocks/mock-chat',
  '@/src/hooks/mock-data/mock-posts': '@/src/mocks/mock-posts',
  '@/src/hooks/mock-data/mock-game': '@/src/mocks/mock-game',
  '@/src/hooks/mock-data/mock-user': '@/src/mocks/mock-user',
  '@/src/hooks/mock-data/mock-users-list': '@/src/mocks/mock-users-list',
  '@/src/hooks/mock-data/useMockGameProfile': '@/src/features/game/hooks/useGameProfiles',
  '@/src/hooks/mock-data/useMockUser': '@/src/features/profile/hooks/useCurrentUser',

  // ── CHAT COMPONENTS ───────────────────────────────────────────────
  // common/
  '@/src/components/chat/chat-input': '@/src/features/chat/components/common/ChatInput',
  '@/src/components/chat/ChatOverflowMenu': '@/src/features/chat/components/common/ChatOverflowMenu',
  '@/src/components/chat/mention-suggestions': '@/src/core/components/AutocompleteDropdown',
  '@/src/components/chat/reply-bar': '@/src/features/chat/components/common/ReplyBar',
  '@/src/components/chat/game-info-card': '@/src/features/chat/components/common/GameInfoCard',
  '@/src/components/chat/media-preview': '@/src/features/chat/components/common/MediaPreview',
  '@/src/components/chat/bubble/chat-message-bubble': '@/src/features/chat/components/common/MessageBubble',
  '@/src/components/chat/bubble/image-attachment': '@/src/features/chat/components/common/ImageAttachment',
  '@/src/components/chat/bubble/reply-preview': '@/src/features/chat/components/common/ReplyPreview',
  '@/src/components/chat/bubble/use-media-dimensions': '@/src/features/chat/hooks/useMediaDimensions',
  // conversation-list/
  '@/src/components/chat/ActiveAvatar': '@/src/features/chat/components/conversation-list/ActiveAvatar',
  '@/src/components/chat/ConversationRow': '@/src/features/chat/components/conversation-list/ConversationRow',
  '@/src/components/chat/chat-search-bar': '@/src/features/chat/components/conversation-list/ChatSearchBar',
  '@/src/components/chat/new-conversation-modal': '@/src/features/chat/components/conversation-list/NewConversationModal',
  // chat-room/
  '@/src/components/chat/chat-header': '@/src/features/chat/components/chat-room/ChatHeader',
  '@/src/components/chat/chat-media-grid': '@/src/features/chat/components/chat-room/ChatMediaGrid',
  '@/src/components/chat/chat-link-list': '@/src/features/chat/components/chat-room/ChatLinkList',
  '@/src/components/chat/message-action-sheet': '@/src/features/chat/components/chat-room/MessageActionSheet',
  // chat-info/
  '@/src/components/chat/group-member-row': '@/src/features/chat/components/chat-info/GroupMemberRow',
  '@/src/components/chat/group-role-badge': '@/src/features/chat/components/chat-info/GroupRoleBadge',
  '@/src/components/chat/ConversationActionsSheet': '@/src/features/chat/components/chat-info/ConversationActionsSheet',
  // chat: game-search-modal → game feature
  '@/src/components/chat/game-search-modal': '@/src/features/game/components/GameSearchModal',

  // ── FEED COMPONENTS ───────────────────────────────────────────────
  '@/src/components/posts/post-card': '@/src/features/feed/components/PostCard',
  '@/src/components/user/post-item': '@/src/features/feed/components/PostCard',
  '@/src/components/feed/feed': '@/src/features/feed/components/Feed',

  // ── POST COMPONENTS ───────────────────────────────────────────────
  '@/src/components/post-details/post-detail-view': '@/src/features/post/components/PostDetailView',
  '@/src/components/post-details/post-comments': '@/src/features/post/components/PostComments',
  '@/src/components/create-post/': '@/src/features/post/components/',

  // ── PROFILE COMPONENTS ────────────────────────────────────────────
  '@/src/components/user/user-profile': '@/src/features/profile/components/ProfileView',
  '@/src/components/user/settings': '@/src/features/profile/components/SettingsView',
  '@/src/components/user/change-password-view': '@/src/features/profile/components/ChangePasswordView',
  '@/src/components/user/edit-profile': '@/src/features/profile/components/EditProfileView',
  '@/src/components/user/favorite-games': '@/src/features/profile/components/FavoriteGamesView',

  // ── GAME COMPONENTS ───────────────────────────────────────────────
  '@/src/components/games/': '@/src/features/game/components/',

  // ── AUTH COMPONENTS ───────────────────────────────────────────────
  '@/src/components/signup/DateOfBirthInput': '@/src/features/auth/components/DateOfBirthPicker',

  // ── EXPLORE ───────────────────────────────────────────────────────
  '@/src/components/explore/': '@/src/features/explore/components/',

  // ── NOTIFICATIONS ─────────────────────────────────────────────────
  '@/src/components/screen/notifications/': '@/src/features/notifications/components/',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [oldImport, newImport] of Object.entries(IMPORT_MAP)) {
    // Escape regex chars then build: from["']<oldImport>['"]
    const escaped = oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(from\\s+['"])${escaped}(['"])`, 'g');

    if (regex.test(content)) {
      content = content.replace(regex, `$1${newImport}$2`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  + ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  return false;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && file !== 'node_modules' && file[0] !== '.') {
      walkDir(fullPath, callback);
    } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(file)) {
      callback(fullPath);
    }
  }
}

function main() {
  const target = process.argv[2] || 'src';
  const targetPath = path.resolve(target);

  console.log(`Migrate imports in: ${targetPath}\n`);

  let migrated = 0;
  let scanned = 0;

  if (fs.statSync(targetPath).isDirectory()) {
    walkDir(targetPath, (filePath) => {
      scanned++;
      if (migrateFile(filePath)) migrated++;
    });
  } else {
    scanned = 1;
    if (migrateFile(targetPath)) migrated++;
  }

  console.log(`\nDone: ${scanned} scanned, ${migrated} migrated`);
}

main();
