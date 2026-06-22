import { NotificationType } from '@/src/features/notifications/types/notifications.types'
import type { Notification } from '@/src/features/notifications/types/notifications.types'

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: NotificationType.FOLLOW,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
    is_accepted: false,
    sender: {
      id: 'user1',
      username: 'gamerDude',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: '2',
    type: NotificationType.FOLLOW,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    read: false,
    is_accepted: false,
    sender: {
      id: 'user2',
      username: 'proPlayerX',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  },
  {
    id: '3',
    type: NotificationType.LIKE_POST,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    sender: {
      id: 'user3',
      username: 'masterChiefFan',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    post_id: 'post123',
    preview: 'liked your post "My new high score!"',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post1',
  },
  {
    id: '4',
    type: NotificationType.COMMENTED_POST,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    sender: {
      id: 'user4',
      username: 'codingGamer',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    post_id: 'post124',
    comment_preview: 'comentó: "Awesome setup!"',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post2',
  },
  {
    id: '5',
    type: NotificationType.INVITATION_GAME,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false,
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
    read: true,
    sender: {
      id: 'user6',
      username: 'epicGamer',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    post_id: 'post125',
    text: '@epicGamer check this out!',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post3',
  },
  {
    id: '7',
    type: NotificationType.SUGGESTION,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
    text: 'Nueva sugerencia de seguimiento:',
    suggestion_type: 'user',
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
    read: true,
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
    type: NotificationType.LIKE_POST,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    read: true,
    sender: {
      id: 'user9',
      username: 'retroGamer',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    post_id: 'post126',
    preview: 'liked your retro gaming post!',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post4',
  },
  {
    id: '10',
    type: NotificationType.COMMENTED_POST,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    read: true,
    sender: {
      id: 'user10',
      username: 'indieDev',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
    post_id: 'post127',
    comment_preview: 'comentó: "Inspiring work!"',
    thumbnail: 'https://placehold.co/50x50/2C2C2E/FFFFFF?text=Post5',
  },
];