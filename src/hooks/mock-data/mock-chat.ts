
import { ActiveUser, Conversation } from "@/src/types/chat.types";

export const CHAT_IMAGES = {
  luna: require('@/assets/images/chat/person-1.png'),
  game: require('@/assets/images/chat/person-2.png'),
  diego: require('@/assets/images/chat/person-3.png'),
  rpg: require('@/assets/images/chat/group-1.png'),
  tombraider: require('@/assets/images/chat/group-2.png'),
} as const;

export const ACTIVE_USERS: ActiveUser[] = [
  { id: "1", name: "Luna", avatar: CHAT_IMAGES.luna, conversationId: "1" },
  { id: "2", name: "Game", avatar: CHAT_IMAGES.game, conversationId: "2"  },
  { id: "3", name: "Diego", avatar: CHAT_IMAGES.diego, conversationId: "4"  },
];


export const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Luna _Streams",
    avatar: CHAT_IMAGES.luna,
    lastMessage: "¿Ya probaste el nuevo DLC?",
    time: "10:30 AM",
  },
  {
    id: "2",
    name: "GameLink",
    avatar: CHAT_IMAGES.game,
    lastMessage: "¿Jugamos rankend ahora?",
    time: "11:15 AM",
  },
  {
    id: "3",
    name: "Fanáticos de RPG",
    avatar: CHAT_IMAGES.rpg,
    lastMessage: "¿Alguien ya terminó Elden Ring?",
    time: "Ayer",
    memberCount: 4,
    sender: "Luna",
    isGroup: true,
  },
  {
    id: "4",
    name: "Diego_Pro",
    avatar: CHAT_IMAGES.diego,
    lastMessage: "Esa jugada fue épica",
    time: "Ayer",
  },
  {
    id: "5",
    name: "Tomb Raider: Legacy of Atlantis",
    avatar: CHAT_IMAGES.tombraider,
    lastMessage: "Nuevo récord!!",
    time: "Hace dos días",
    memberCount: 3,
    sender: "Luis",
    isGroup: true,
  },
];

