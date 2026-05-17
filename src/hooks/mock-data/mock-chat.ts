import { Image } from "react-native";
import { ActiveUser, Conversation, GroupMember, GroupRole } from "@/src/types/chat.types";

// Asset requires
const lunaAsset = require('@/assets/images/chat/person-1.png');
const gameAsset = require('@/assets/images/chat/person-2.png');
const diegoAsset = require('@/assets/images/chat/person-3.png');
const rpgAsset = require('@/assets/images/chat/group-1.png');
const tombraiderAsset = require('@/assets/images/chat/group-2.png');

// Resolve to URIs for type-safe usage
const CHAT_IMAGES = {
  luna: Image.resolveAssetSource(lunaAsset).uri,
  game: Image.resolveAssetSource(gameAsset).uri,
  diego: Image.resolveAssetSource(diegoAsset).uri,
  rpg: Image.resolveAssetSource(rpgAsset).uri,
  tombraider: Image.resolveAssetSource(tombraiderAsset).uri,
} as const;

export const ACTIVE_USERS: ActiveUser[] = [
  { id: "1", username: "Luna", profile_pic: CHAT_IMAGES.luna, conversationId: "1" },
  { id: "2", username: "Game", profile_pic: CHAT_IMAGES.game, conversationId: "2" },
  { id: "3", username: "Diego", profile_pic: CHAT_IMAGES.diego, conversationId: "4" },
];

// Helper to create mock GroupMember
const createMockMember = (id: string, userId: string, username: string, role: GroupRole = GroupRole.MEMBER): GroupMember => ({
  id,
  user_id: userId,
  conversation: "",
  role,
  joined_at: new Date().toISOString(),
  left_at: null,
  username,
  profile_pic: CHAT_IMAGES.luna, // Default avatar for mock members
});

export const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Luna _Streams",
    group_picture: CHAT_IMAGES.luna,
    created_by: "user1",
    created_at: new Date().toISOString(),
    last_message: "¿Ya probaste el nuevo DLC?",
    last_message_time: "10:30 AM",
    is_group: false,
    members: [createMockMember("m1", "user1", "Luna _Streams")],
  },
  {
    id: "2",
    name: "GameLink",
    group_picture: CHAT_IMAGES.game,
    created_by: "user2",
    created_at: new Date().toISOString(),
    last_message: "¿Jugamos rankend ahora?",
    last_message_time: "11:15 AM",
    is_group: false,
    members: [createMockMember("m2", "user2", "GameLink")],
  },
  {
    id: "3",
    name: "Fanáticos de RPG",
    group_picture: CHAT_IMAGES.rpg,
    created_by: "user1",
    created_at: new Date().toISOString(),
    last_message: "¿Alguien ya terminó Elden Ring?",
    last_message_time: "Ayer",
    last_message_sender: "Luna",
    member_count: 4,
    is_group: true,
    members: [
      createMockMember("m3", "user1", "Luna", GroupRole.ADMIN),
      createMockMember("m4", "user3", "Carlos"),
      createMockMember("m5", "user4", "Maria"),
      createMockMember("m6", "user5", "Pedro"),
    ],
  },
  {
    id: "4",
    name: "Diego_Pro",
    group_picture: CHAT_IMAGES.diego,
    created_by: "user3",
    created_at: new Date().toISOString(),
    last_message: "Esa jugada fue épica",
    last_message_time: "Ayer",
    is_group: false,
    members: [createMockMember("m7", "user3", "Diego_Pro")],
  },
  {
    id: "5",
    name: "Tomb Raider: Legacy of Atlantis",
    group_picture: CHAT_IMAGES.tombraider,
    created_by: "user4",
    created_at: new Date().toISOString(),
    last_message: "Nuevo récord!!",
    last_message_time: "Hace dos días",
    last_message_sender: "Luis",
    member_count: 3,
    is_group: true,
    members: [
      createMockMember("m8", "user4", "Luis", GroupRole.OWNER),
      createMockMember("m9", "user5", "Ana"),
      createMockMember("m10", "user6", "Roberto"),
    ],
  },
];
