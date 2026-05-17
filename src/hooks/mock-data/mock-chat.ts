import { Image } from "react-native";
import { ActiveUser, Conversation, GroupMember, GroupRole, Message, MessageType } from "@/src/types/chat.types";

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

// Helper to create mock Message
const createMockMessage = (
  id: string,
  sentBy: string,
  username: string,
  text: string,
  sentAt: string,
  replyTo: string | null = null,
  attachedMedia: string[] | null = null
): Message => ({
  id,
  sent_by: sentBy,
  conversation: null,
  reply_to: replyTo,
  type: MessageType.DIRECT_MESSAGE,
  message_text: text,
  attached_media: attachedMedia,
  sent_at: sentAt,
  sender_username: username,
  sender_profile_pic: CHAT_IMAGES.luna,
  reply_to_message: null,
});

// Generate timestamps for mock messages (last 24-48 hours)
const getTimestamp = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

// Generate mock messages for 1:1 conversation with Luna
const generateLunaMessages = (): Message[] => {
  const currentUserId = "current_user";
  const contactUserId = "luna_user";
  const contactName = "Luna _Streams";

  return [
    createMockMessage("msg1", contactUserId, contactName, "¡Hola! ¿Cómo estás?", getTimestamp(1200)),
    createMockMessage("msg2", currentUserId, "You", "¡Hola Luna! Todo bien, jugando un poco.", getTimestamp(1195)),
    createMockMessage("msg3", contactUserId, contactName, "¿A qué estás jugando?", getTimestamp(1180)),
    createMockMessage("msg4", currentUserId, "You", "Estoy probando el nuevo RPG que salió ayer.", getTimestamp(1175)),
    createMockMessage("msg5", contactUserId, contactName, "¡Oh sí! Lo vi en Steam, se ve increíble 🎮", getTimestamp(1160)),
    createMockMessage("msg6", currentUserId, "You", "Sí, los gráficos son impresionantes.", getTimestamp(1155)),
    createMockMessage("msg7", contactUserId, contactName, "¿Ya llegaste a la primera boss fight?", getTimestamp(1140)),
    createMockMessage("msg8", currentUserId, "You", "Sí, me costó unas 5 intentos pero lo logré 😅", getTimestamp(1135)),
    createMockMessage("msg9", contactUserId, contactName, "Jajaja, esos juegos son difíciles al principio", getTimestamp(1120)),
    createMockMessage("msg10", currentUserId, "You", "Totalmente, pero vale la pena.", getTimestamp(1115)),
    createMockMessage("msg11", contactUserId, contactName, "Por cierto, ¿viste el trailer del DLC de Elden Ring?", getTimestamp(1100)),
    createMockMessage("msg12", currentUserId, "You", "¡Sí! Se ve épico, no puedo esperar.", getTimestamp(1095)),
    createMockMessage("msg13", contactUserId, contactName, "Ya probaste el nuevo DLC?", getTimestamp(1080)),
    createMockMessage("msg14", currentUserId, "You", "Aún no, lo estoy descargando ahora mismo.", getTimestamp(1075)),
    createMockMessage("msg15", contactUserId, contactName, "Cuéntame qué tal cuando lo pruebes 👀", getTimestamp(1060)),
    createMockMessage("msg16", currentUserId, "You", "Por supuesto, te aviso.", getTimestamp(1055)),
    createMockMessage("msg17", contactUserId, contactName, "Genial, ¿y tienes planeado hacer stream de eso?", getTimestamp(1040)),
    createMockMessage("msg18", currentUserId, "You", "Sí, probablemente esta noche a las 8.", getTimestamp(1035)),
    createMockMessage("msg19", contactUserId, contactName, "¡Perfecto! Me conectaré para verlo 🎥", getTimestamp(1020)),
    createMockMessage("msg20", currentUserId, "You", "¡Genial! Gracias por el apoyo.", getTimestamp(1015)),
    createMockMessage("msg21", contactUserId, contactName, "¿Tienes alguna build específica en mente?", getTimestamp(1000)),
    createMockMessage("msg22", currentUserId, "You", "Estoy pensando en ir full mago esta vez.", getTimestamp(995)),
    createMockMessage("msg23", contactUserId, contactName, "Buena elección, la magia está muy potente en este DLC", getTimestamp(980)),
    createMockMessage("msg24", currentUserId, "You", "Eso me han dicho, a ver cómo me va.", getTimestamp(975)),
    createMockMessage("msg25", contactUserId, contactName, "¡Suerte! Nos vemos en el stream 🍀", getTimestamp(960)),
    createMockMessage("msg26", currentUserId, "You", "¡Nos vemos!", getTimestamp(955)),
  ];
};

// Generate mock messages for 1:1 conversation with GameLink
const generateGameLinkMessages = (): Message[] => {
  const currentUserId = "current_user";
  const contactUserId = "gamelink_user";
  const contactName = "GameLink";

  return [
    createMockMessage("msg1", contactUserId, contactName, "¿Estás online?", getTimestamp(800)),
    createMockMessage("msg2", currentUserId, "You", "Sí, justo acabo de entrar.", getTimestamp(795)),
    createMockMessage("msg3", contactUserId, contactName, "¿Jugamos rankend ahora?", getTimestamp(780)),
    createMockMessage("msg4", currentUserId, "You", "Dale, déjame invitarte.", getTimestamp(775)),
    createMockMessage("msg5", contactUserId, contactName, "Listo, estoy en el lobby", getTimestamp(760)),
    createMockMessage("msg6", currentUserId, "You", "Perfecto, iniciando.", getTimestamp(755)),
    createMockMessage("msg7", contactUserId, contactName, "Buena partida la anterior", getTimestamp(600)),
    createMockMessage("msg8", currentUserId, "You", "Sí, estuvo reñida hasta el final.", getTimestamp(595)),
    createMockMessage("msg9", contactUserId, contactName, "Esa jugada en mid fue épica", getTimestamp(580)),
    createMockMessage("msg10", currentUserId, "You", "¡Gracias! Me arriesgué pero salió bien.", getTimestamp(575)),
    createMockMessage("msg11", contactUserId, contactName, "¿Otra?", getTimestamp(560)),
    createMockMessage("msg12", currentUserId, "You", "Dale, pero primero déjame cambiar de build.", getTimestamp(555)),
    createMockMessage("msg13", contactUserId, contactName, "¿A qué estás pensando cambiar?", getTimestamp(540)),
    createMockMessage("msg14", currentUserId, "You", "Voy a probar el support, el carry no funcionó.", getTimestamp(535)),
    createMockMessage("msg15", contactUserId, contactName, "Suena bien, necesitamos más support.", getTimestamp(520)),
    createMockMessage("msg16", currentUserId, "You", "Exacto, la última partida nos faltó curación.", getTimestamp(515)),
    createMockMessage("msg17", contactUserId, contactName, "Ya, invita cuando estés listo", getTimestamp(500)),
    createMockMessage("msg18", currentUserId, "You", "Listo, invitación enviada.", getTimestamp(495)),
    createMockMessage("msg19", contactUserId, contactName, "Recibida, entrando...", getTimestamp(480)),
    createMockMessage("msg20", currentUserId, "You", "🎮", getTimestamp(475)),
  ];
};

// Generate mock messages for 1:1 conversation with Diego_Pro
const generateDiegoMessages = (): Message[] => {
  const currentUserId = "current_user";
  const contactUserId = "diego_user";
  const contactName = "Diego_Pro";

  return [
    createMockMessage("msg1", contactUserId, contactName, "Bro, ¿viste mi último clip?", getTimestamp(2000)),
    createMockMessage("msg2", currentUserId, "You", "Sí, fue increíble ese headshot.", getTimestamp(1995)),
    createMockMessage("msg3", contactUserId, contactName, "Esa jugada fue épica", getTimestamp(1980)),
    createMockMessage("msg4", currentUserId, "You", "¿Cómo hiciste para verlo? Estaba en la smoke.", getTimestamp(1975)),
    createMockMessage("msg5", contactUserId, contactName, "Jajaja, intuición pura 😎", getTimestamp(1960)),
    createMockMessage("msg6", currentUserId, "You", "Tienes demasiadas horas en este juego.", getTimestamp(1955)),
    createMockMessage("msg7", contactUserId, contactName, "Unas 2000 horas ya...", getTimestamp(1940)),
    createMockMessage("msg8", currentUserId, "You", "¡Wow! Eso explica todo.", getTimestamp(1935)),
    createMockMessage("msg9", contactUserId, contactName, "¿Tú cuántas tienes?", getTimestamp(1920)),
    createMockMessage("msg10", currentUserId, "You", "Como 800, me falta mucho.", getTimestamp(1915)),
    createMockMessage("msg11", contactUserId, contactName, "Está bien, lo importante es divertirse.", getTimestamp(1900)),
    createMockMessage("msg12", currentUserId, "You", "Totalmente, aunque ganar ayuda 😅", getTimestamp(1895)),
    createMockMessage("msg13", contactUserId, contactName, "Jajaja cierto, el tilt es real.", getTimestamp(1880)),
    createMockMessage("msg14", currentUserId, "You", "¿Jugamos mañana?", getTimestamp(1875)),
    createMockMessage("msg15", contactUserId, contactName, "Dale, a qué hora?", getTimestamp(1860)),
    createMockMessage("msg16", currentUserId, "You", "¿A las 8 PM te parece?", getTimestamp(1855)),
    createMockMessage("msg17", contactUserId, contactName, "Perfecto, allí estaré.", getTimestamp(1840)),
    createMockMessage("msg18", currentUserId, "You", "Genial, nos vemos entonces.", getTimestamp(1835)),
    createMockMessage("msg19", contactUserId, contactName, "👍", getTimestamp(1820)),
  ];
};

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
    messages: generateLunaMessages(),
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
    messages: generateGameLinkMessages(),
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
    messages: generateDiegoMessages(),
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
