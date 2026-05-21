import { Image } from "react-native";
import type {
  ActiveUser,
  ContactInfo,
  Conversation,
  GroupMember,
  SharedFileItem,
  SharedLinkItem,
  SharedMediaItem,
} from "@/src/types/chat.types";
import { AttachmentType, GroupRole, Message, MessageType } from "@/src/types/chat.types";

const lunaAsset = require("@/assets/images/chat/person-1.png");
const gameAsset = require("@/assets/images/chat/person-2.png");
const rpgAsset = require("@/assets/images/chat/group-1.png");

const CHAT_IMAGES = {
  luna: Image.resolveAssetSource(lunaAsset).uri,
  game: Image.resolveAssetSource(gameAsset).uri,
  rpg: Image.resolveAssetSource(rpgAsset).uri,
} as const;

export const ACTIVE_USERS: ActiveUser[] = [
  {
    id: "1",
    username: "Luna",
    profile_pic: CHAT_IMAGES.luna,
    conversationId: "1",
  },
  {
    id: "2",
    username: "Game",
    profile_pic: CHAT_IMAGES.game,
    conversationId: "2",
  },
];

const createMockMember = (
  id: string,
  userId: string,
  username: string,
  role: GroupRole = GroupRole.MEMBER,
  profilePic?: string,
): GroupMember => ({
  id,
  user_id: userId,
  conversation: "",
  role,
  joined_at: new Date().toISOString(),
  left_at: null,
  username,
  profile_pic: profilePic ?? CHAT_IMAGES.luna,
});

const createMockMessage = (
  id: string,
  sentBy: string,
  username: string,
  text: string | null,
  sentAt: string,
  replyTo: string | null = null,
  attachedMedia: string[] | null = null,
  type: MessageType = MessageType.DIRECT_MESSAGE,
): Message => ({
  id,
  sent_by: sentBy,
  conversation: null,
  reply_to: replyTo,
  type,
  message_text: text,
  attached_media: attachedMedia?.map((url) => ({
    url,
    type: AttachmentType.IMAGE,
  })) ?? null,
  sent_at: sentAt,
  sender_username: username,
  sender_profile_pic: CHAT_IMAGES.luna,
  reply_to_message: null,
});

const getTimestamp = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

const generateLunaMessages = (): Message[] => {
  const me = "current_user";
  const luna = "luna_user";
  const name = "Luna _Streams";

  return [
    createMockMessage(
      "dm1",
      luna,
      name,
      "¡Hola! ¿Cómo estás?",
      getTimestamp(1200),
    ),
    createMockMessage(
      "dm2",
      me,
      "You",
      "¡Hola Luna! Todo bien, jugando un poco.",
      getTimestamp(1195),
    ),
    createMockMessage(
      "dm3",
      luna,
      name,
      "¿A qué estás jugando?",
      getTimestamp(1180),
    ),
    createMockMessage(
      "dm4",
      me,
      "You",
      "Estoy probando el nuevo RPG que salió ayer.",
      getTimestamp(1175),
    ),
    createMockMessage(
      "dm5",
      luna,
      name,
      "¡Oh sí! Lo vi en Steam, se ve increíble 🎮",
      getTimestamp(1160),
    ),
    createMockMessage(
      "dm6",
      me,
      "You",
      "Sí, los gráficos son impresionantes.",
      getTimestamp(1155),
    ),
    createMockMessage(
      "dm7",
      luna,
      name,
      "¿Ya llegaste a la primera boss fight?",
      getTimestamp(1140),
    ),
    createMockMessage(
      "dm8",
      me,
      "You",
      "Mira esta captura de la pelea 🔥",
      getTimestamp(1135),
      null,
      ["https://picsum.photos/seed/game1/400/400"],
    ),
    createMockMessage(
      "dm9",
      luna,
      name,
      "Te comparto mi build actual",
      getTimestamp(1120),
      null,
      ["https://picsum.photos/seed/game8/400/400"],
    ),
    createMockMessage(
      "dm10",
      me,
      "You",
      "Acá te mando el clip del boss",
      getTimestamp(1115),
      null,
      [
        "https://picsum.photos/seed/game9/400/400",
        "https://picsum.photos/seed/game10/400/400",
      ],
    ),
    createMockMessage(
      "dm11",
      luna,
      name,
      "Encontré este mapa secreto!",
      getTimestamp(1100),
      null,
      ["https://picsum.photos/seed/game13/400/400"],
    ),
    createMockMessage(
      "dm12",
      me,
      "You",
      "Increíble, se ve genial",
      getTimestamp(1095),
    ),
    createMockMessage(
      "dm13",
      luna,
      name,
      "Por cierto, ¿viste el trailer del DLC de Elden Ring?",
      getTimestamp(1080),
    ),
    createMockMessage(
      "dm14",
      me,
      "You",
      "¡Sí! Se ve épico, no puedo esperar.",
      getTimestamp(1075),
    ),
    createMockMessage(
      "dm15",
      luna,
      name,
      "¿Tienes alguna build específica en mente?",
      getTimestamp(1060),
    ),
    createMockMessage(
      "dm16",
      me,
      "You",
      "Full mago esta vez 💫",
      getTimestamp(1055),
    ),
  ];
};

const generateGroupMessages = (): Message[] => {
  return [
    createMockMessage(
      "gm1",
      "user1",
      "Luna",
      "¿Alguien ya terminó Elden Ring?",
      getTimestamp(2000),
      null,
      null,
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm2",
      "user3",
      "Carlos",
      "Yo voy por la mitad, es enorme",
      getTimestamp(1990),
      null,
      null,
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm3",
      "user4",
      "Maria",
      "Acabo de matar a Malenia después de 50 intentos 😭",
      getTimestamp(1980),
      null,
      null,
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm4",
      "user5",
      "Pedro",
      "Miren el build que armé",
      getTimestamp(1970),
      null,
      null,
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm5",
      "user1",
      "Luna",
      "Miren esta captura del último jefe",
      getTimestamp(1960),
      null,
      ["https://picsum.photos/seed/rpg1/400/400"],
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm6",
      "user5",
      "Pedro",
      "Yo también capture algo increíble",
      getTimestamp(1950),
      null,
      [
        "https://picsum.photos/seed/rpg2/400/400",
        "https://picsum.photos/seed/rpg3/400/400",
      ],
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm7",
      "user3",
      "Carlos",
      "A mí me faltan varios jefes aún",
      getTimestamp(1940),
      null,
      null,
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm8",
      "user4",
      "Maria",
      "El mapa secreto de la zona subterránea es impresionante",
      getTimestamp(1930),
      null,
      null,
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm9",
      "user1",
      "Luna",
      "Confirmo, encontré un pasadizo oculto",
      getTimestamp(1920),
      null,
      [
        "https://picsum.photos/seed/rpg4/400/400",
        "https://picsum.photos/seed/rpg5/400/400",
        "https://picsum.photos/seed/rpg6/400/400",
      ],
      MessageType.GROUP_MESSAGE,
    ),
    createMockMessage(
      "gm10",
      "user5",
      "Pedro",
      "¿Alguien quiere cooperar para el jefe final?",
      getTimestamp(1910),
      null,
      null,
      MessageType.GROUP_MESSAGE,
    ),
  ];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Luna _Streams",
    group_picture: CHAT_IMAGES.luna,
    created_by: "user1",
    created_at: new Date().toISOString(),
    last_message: "Full mago esta vez 💫",
    last_message_time: "10:30 AM",
    is_group: false,
    members: [
      createMockMember(
        "m1",
        "user1",
        "Luna _Streams",
        GroupRole.MEMBER,
        CHAT_IMAGES.luna,
      ),
    ],
    messages: generateLunaMessages(),
  },
  {
    id: "2",
    name: "GameLink",
    group_picture: CHAT_IMAGES.game,
    created_by: "user2",
    created_at: new Date().toISOString(),
    last_message: undefined,
    last_message_time: undefined,
    is_group: false,
    members: [
      createMockMember(
        "m2",
        "user2",
        "GameLink",
        GroupRole.MEMBER,
        CHAT_IMAGES.game,
      ),
    ],
  },
  {
    id: "3",
    name: "Fanáticos de RPG",
    group_picture: CHAT_IMAGES.rpg,
    created_by: "user1",
    created_at: new Date().toISOString(),
    last_message: "¿Alguien quiere cooperar para el jefe final?",
    last_message_time: "Ayer",
    last_message_sender: "Pedro",
    member_count: 4,
    is_group: true,
    members: [
      createMockMember("m3", "user1", "Luna", GroupRole.ADMIN),
      createMockMember("m4", "user3", "Carlos"),
      createMockMember("m5", "user4", "Maria"),
      createMockMember("m6", "user5", "Pedro"),
    ],
    messages: generateGroupMessages(),
  },
];

export const MOCK_CONTACT_INFO: Record<string, ContactInfo> = {
  user1: {
    bio: "Streamer de RPGs | Elden Ring fan 🎮",
    username: "luna_streams",
    email: "luna@gamemail.com",
  },
  user2: {
    bio: "Jugador competitivo. #1 en rankeds.",
    username: "gamelink_off",
    email: "gamelink@gamemail.com",
  },
};

export const MOCK_SHARED_MEDIA: Record<string, SharedMediaItem[]> = {
  "1": [
    {
      id: "sm1",
      url: "https://picsum.photos/seed/game1/400/400",
      duration: "11:29",
      sent_at: getTimestamp(1135),
      message_id: "dm8",
    },
    {
      id: "sm2",
      url: "https://picsum.photos/seed/game8/400/400",
      duration: "12:05",
      sent_at: getTimestamp(1120),
      message_id: "dm9",
    },
    {
      id: "sm3",
      url: "https://picsum.photos/seed/game9/400/400",
      duration: "09:37",
      sent_at: getTimestamp(1115),
      message_id: "dm10",
    },
    {
      id: "sm4",
      url: "https://picsum.photos/seed/game10/400/400",
      duration: "14:21",
      sent_at: getTimestamp(1115),
      message_id: "dm10",
    },
    {
      id: "sm5",
      url: "https://picsum.photos/seed/game13/400/400",
      duration: "13:09",
      sent_at: getTimestamp(1100),
      message_id: "dm11",
    },
  ],
  "3": [
    {
      id: "sm6",
      url: "https://picsum.photos/seed/rpg1/400/400",
      duration: "10:15",
      sent_at: getTimestamp(1960),
      message_id: "gm5",
    },
    {
      id: "sm7",
      url: "https://picsum.photos/seed/rpg2/400/400",
      duration: "08:42",
      sent_at: getTimestamp(1950),
      message_id: "gm6",
    },
    {
      id: "sm8",
      url: "https://picsum.photos/seed/rpg3/400/400",
      duration: "09:03",
      sent_at: getTimestamp(1950),
      message_id: "gm6",
    },
    {
      id: "sm9",
      url: "https://picsum.photos/seed/rpg4/400/400",
      duration: "07:38",
      sent_at: getTimestamp(1920),
      message_id: "gm9",
    },
    {
      id: "sm10",
      url: "https://picsum.photos/seed/rpg5/400/400",
      duration: "11:14",
      sent_at: getTimestamp(1920),
      message_id: "gm9",
    },
    {
      id: "sm11",
      url: "https://picsum.photos/seed/rpg6/400/400",
      duration: "06:55",
      sent_at: getTimestamp(1920),
      message_id: "gm9",
    },
  ],
};

export const MOCK_SHARED_FILES: Record<string, SharedFileItem[]> = {
  "1": [
    {
      id: "sf1",
      filename: "Screenshot_2024-01-15_at_14.32.10.png",
      file_size: "2.4 MB",
      file_type: "image/png",
      sent_at: getTimestamp(800),
      message_id: "dm8",
    },
    {
      id: "sf2",
      filename: "gameplay_clip_01.mp4",
      file_size: "15.8 MB",
      file_type: "video/mp4",
      sent_at: getTimestamp(780),
      message_id: "dm10",
    },
    {
      id: "sf3",
      filename: "build_guide_v3.pdf",
      file_size: "1.2 MB",
      file_type: "application/pdf",
      sent_at: getTimestamp(760),
      message_id: "dm12",
    },
  ],
  "3": [
    {
      id: "sf4",
      filename: "screenshot_boss_fight.png",
      file_size: "3.1 MB",
      file_type: "image/png",
      sent_at: getTimestamp(1960),
      message_id: "gm5",
    },
    {
      id: "sf5",
      filename: "secret_map_location.jpg",
      file_size: "2.8 MB",
      file_type: "image/jpeg",
      sent_at: getTimestamp(1920),
      message_id: "gm9",
    },
  ],
};

export const MOCK_SHARED_LINKS: Record<string, SharedLinkItem[]> = {
  "1": [
    {
      id: "sl1",
      url: "https://www.youtube.com/watch?v=eldendringdlc",
      title: "Elden Ring DLC - Official Trailer",
      sent_at: getTimestamp(1080),
      message_id: "dm13",
    },
    {
      id: "sl2",
      url: "https://steamcommunity.com/sharedfiles/filedetails/?id=123456",
      title: "Guía completa de builds para Elden Ring",
      sent_at: getTimestamp(1060),
      message_id: "dm15",
    },
  ],
  "3": [
    {
      id: "sl3",
      url: "https://eldenring.wiki.fextralife.com",
      title: "Elden Ring Wiki - Guía interactiva",
      sent_at: getTimestamp(1940),
      message_id: "gm7",
    },
  ],
};
