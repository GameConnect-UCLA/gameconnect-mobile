import type { User } from '@/src/core/types/user.types';
import { UserRole, UserState } from '@/src/core/types/user.types';

export const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  displayName: 'JORGE SILVA',
  username: 'jorgetech',
  role: UserRole.USER,
  email: 'jorgetech@gmail.com',
  bio: 'Gamer Profesional\nStreamer\nAmante de los FPS y MOBA',
  birthDate: '1995-05-15',
  accountSettings: {
    theme: 'dark',
    notifications: true,
  },
  profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
  coverPic: 'https://static.wikia.nocookie.net/videojuego/images/7/7c/Tomb_Raider_acci%C3%B3n.jpg/revision/latest/scale-to-width-down/1200?cb=20180616142353',
  state: UserState.ACTIVE,
  verified: true,
  createdAt: 'Diciembre 2023',
  bannedAt: null,
  banReason: null,
  deletedAt: null,
  stats: {
    posts: 22,
    followers: 20,
    following: 10,
  },
  favoriteGames: [
    {
      id: '1',
      name: 'Dead Space',
      imageUrl: 'https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg',
      description: 'Horror y supervivencia en el espacio.'
    },
    {
      id: '2',
      name: 'Resident Evil 4',
      imageUrl: 'https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg',
      description: 'El clásico de acción y terror.'
    },
    {
      id: '3',
      name: 'Gears Of War 3',
      imageUrl: 'https://th.bing.com/th/id/R.3d6d419d5e5c37b63d3c85ddd31be9d6',
      description: 'El épico cierre de la trilogía original.'
    },
  ],
  featuredPost: {
    title: 'DEAD SPACE',
    tag: 'FPS',
    description: 'La tensión y el ambiente opresivo del USG Ishimura.',
  },
  posts: [
    {
      id: 'p1',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg' },
      title: 'DEAD SPACE',
      content: 'La tensión y el ambiente opresivo del USG Ishimura.',
      hashtags: ['#SurvivalHorror', '#DeadSpace'],
      media: { urls: ['https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg'] },
      isReview: false,
      reviewedGame: '',
      likesCounter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', authorUser: { displayName: 'Isaac Clarke', username: 'isaac', profilePic: 'https://i.pravatar.cc/150?u=isaac' }, content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', authorUser: { displayName: 'Nicole Brennan', username: 'nicole', profilePic: 'https://i.pravatar.cc/150?u=nicole' }, content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-01',
      lastModifiedAt: '2024-06-01',
      deletedAt: null,
      isRepost: false,
      originalPostId: '',
    },
    {
      id: 'p2',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg' },
      title: 'RESIDENT EVIL 4',
      content: 'Leon S. Kennedy se enfrenta a una pesadilla en la España rural.',
      hashtags: ['#ResidentEvil', '#Terror'],
      media: { urls: ['https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg'] },
      isReview: false,
      reviewedGame: '',
      likesCounter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', authorUser: { displayName: 'Isaac Clarke', username: 'isaac', profilePic: 'https://i.pravatar.cc/150?u=isaac' }, content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', authorUser: { displayName: 'Nicole Brennan', username: 'nicole', profilePic: 'https://i.pravatar.cc/150?u=nicole' }, content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-02',
      lastModifiedAt: '2024-06-02',
      deletedAt: null,
      isRepost: false,
      originalPostId: '',
    },
    {
      id: 'p3',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg' },
      title: 'GEARS OF WAR 3',
      content: 'Acción frenética, coberturas y un modo horda que engancha.',
      hashtags: ['#GearsOfWar', '#TPS'],
      media: { urls: ['https://images.gamersyde.com/image_gears_of_war_3-14855-2017_0001.jpg'] },
      isReview: false,
      reviewedGame: '',
      likesCounter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', authorUser: { displayName: 'Isaac Clarke', username: 'isaac', profilePic: 'https://i.pravatar.cc/150?u=isaac' }, content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', authorUser: { displayName: 'Nicole Brennan', username: 'nicole', profilePic: 'https://i.pravatar.cc/150?u=nicole' }, content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-03',
      lastModifiedAt: '2024-06-03',
      deletedAt: null,
      isRepost: false,
      originalPostId: '',
    },
    {
      id: 'p4',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg' },
      title: 'ELDEN RING',
      content: 'Explorando las Tierras Intermedias.',
      hashtags: ['#EldenRing', '#SoulsLike'],
      media: { urls: ['https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-new-header-mobile.jpg'] },
      isReview: false,
      reviewedGame: '',
      likesCounter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', authorUser: { displayName: 'Isaac Clarke', username: 'isaac', profilePic: 'https://i.pravatar.cc/150?u=isaac' }, content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', authorUser: { displayName: 'Nicole Brennan', username: 'nicole', profilePic: 'https://i.pravatar.cc/150?u=nicole' }, content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-04',
      lastModifiedAt: '2024-06-04',
      deletedAt: null,
      isRepost: false,
      originalPostId: '',
    }
  ]
};
