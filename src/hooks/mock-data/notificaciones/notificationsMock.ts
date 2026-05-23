export enum NotificationType {
  FOLLOW_REQUEST = 'FOLLOW_REQUEST',
  SUGGESTION = 'SUGGESTION',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  INVITATION_GAME = 'INVITATION_GAME',
  INVITATION_TEAM = 'INVITATION_TEAM',
  MENTION = 'MENTION',
}

interface BaseNotification {
  id: string;
  type: NotificationType;
  createdAt: string; // ISO date string
  isRead: boolean;
}

export interface FollowRequestNotification extends BaseNotification {
  type: NotificationType.FOLLOW_REQUEST;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  isAccepted: boolean;
}

export interface SuggestionNotification extends BaseNotification {
  type: NotificationType.SUGGESTION;
  text: string;
  suggestionType: 'user' | 'game' | 'team';
  target: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface LikeNotification extends BaseNotification {
  type: NotificationType.LIKE;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  postId: string;
  postPreview: string; // e.g., "liked your post 'Amazing sunset...'"
  thumbnail?: string;
}

export interface CommentNotification extends BaseNotification {
  type: NotificationType.COMMENT;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  postId: string;
  commentPreview: string; // e.g., "commented: 'Great shot!'"
  thumbnail?: string;
}

export interface InvitationGameNotification extends BaseNotification {
  type: NotificationType.INVITATION_GAME;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  game: {
    id: string;
    name: string;
    cover: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
}

export interface InvitationTeamNotification extends BaseNotification {
  type: NotificationType.INVITATION_TEAM;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  team: {
    id: string;
    name: string;
    logo: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
}

export interface MentionNotification extends BaseNotification {
  type: NotificationType.MENTION;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  postId?: string; // If mention is in a post
  commentId?: string; // If mention is in a comment
  text: string; // The text where the mention occurred
  thumbnail?: string;
}

export type Notification =
  | FollowRequestNotification
  | SuggestionNotification
  | LikeNotification
  | CommentNotification
  | InvitationGameNotification
  | InvitationTeamNotification
  | MentionNotification;


export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: NotificationType.FOLLOW_REQUEST,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isRead: false,
    isAccepted: false,
    sender: {
      id: 'user1',
      username: 'gamerDude',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: '2',
    type: NotificationType.FOLLOW_REQUEST,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isRead: false,
    isAccepted: false,
    sender: {
      id: 'user2',
      username: 'proPlayerX',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  },
  {
    id: '3',
    type: NotificationType.LIKE,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isRead: false,
    sender: {
      id: 'user3',
      username: 'masterChiefFan',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    postId: 'post123',
    postPreview: 'liked your post "My new high score!"',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post1',
  },
  {
    id: '4',
    type: NotificationType.COMMENT,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    sender: {
      id: 'user4',
      username: 'codingGamer',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    postId: 'post124',
    commentPreview: 'comentó: "Awesome setup!"',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post2',
  },
  {
    id: '5',
    type: NotificationType.INVITATION_GAME,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: false,
    status: 'pending',
    sender: {
      id: 'user5',
      username: 'partyMaster',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    game: {
      id: 'game1',
      name: 'Cyberpunk 2077',
      cover: 'https://placehold.co/150x150/FF0000/FFFFFF?text=CP2077',
    },
  },
  {
    id: '6',
    type: NotificationType.MENTION,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    sender: {
      id: 'user6',
      username: 'epicGamer',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    postId: 'post125',
    text: '@epicGamer check this out!',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post3',
  },
  {
    id: '7',
    type: NotificationType.SUGGESTION,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    isRead: true,
    text: 'Nueva sugerencia de seguimiento:',
    suggestionType: 'user',
    target: {
      id: 'user7',
      name: 'pixelArtist',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
  },
  {
    id: '8',
    type: NotificationType.INVITATION_TEAM,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    isRead: true,
    status: 'pending',
    sender: {
      id: 'user8',
      username: 'teamLeader',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    team: {
      id: 'team1',
      name: 'The Elite Squad',
      logo: 'https://placehold.co/150x150/0000FF/FFFFFF?text=TES',
    },
  },
  {
    id: '9',
    type: NotificationType.LIKE,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    isRead: true,
    sender: {
      id: 'user9',
      username: 'retroGamer',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    postId: 'post126',
    postPreview: 'liked your retro gaming post!',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post4',
  },
  {
    id: '10',
    type: NotificationType.COMMENT,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    isRead: true,
    sender: {
      id: 'user10',
      username: 'indieDev',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    postId: 'post127',
    commentPreview: 'comentó: "Inspiring work!"',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post5',
  },
];