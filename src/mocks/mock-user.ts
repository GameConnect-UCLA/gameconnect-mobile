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
  
  // Configuración de cuenta
  accountSettings: {
    theme: 'dark',
    notifications: true,
  },

  // Imágenes de Perfil y Portada
  profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
  coverPic: 'https://static.wikia.nocookie.net/videojuego/images/7/7c/Tomb_Raider_acci%C3%B3n.jpg/revision/latest/scale-to-width-down/1200?cb=20180616142353',

  // Estado de la cuenta
  state: UserState.ACTIVE,
  verified: true,
  createdAt: 'Diciembre 2023',
  bannedAt: null,
  banReason: null,
  deletedAt: null,

  // Estadísticas del perfil
  stats: {
    posts: 22,
    followers: 20,
    following: 10,
  },

  // Juegos Favoritos
  favoriteGames: [
    {
      id: '1',
      name: 'Dead Space',
      imageUrl: 'https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg',
      description: 'Horror y supervivencia en el espacio. La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento.'
    },
    {
      id: '2',
      name: 'Resident Evil 4',
      imageUrl: 'https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg',
      description: 'El clásico de acción y terror que revolucionó la saga. Defiende a Ashley y vive una experiencia llena de disparos.'
    },
    {
      id: '3',
      name: 'Gears Of War 3',
      imageUrl: 'https://th.bing.com/th/id/R.3d6d419d5e5c37b63d3c85ddd31be9d6?rik=YvTnKE9%2fOtsLpg&riu=http%3a%2f%2fimages.gamersyde.com%2fimage_gears_of_war_3-14855-2017_0001.jpg&ehk=O3C8u8EQi3blk%2faqiyRUWAD938a1H7TRgrnUfv%2bm5dg%3d&risl=&pid=ImgRaw&r=0',
      description: 'El épico cierre de la trilogía original. Acción frenética en coberturas y un modo horda que engancha.'
    },
  ],

  // Post destacado
  featuredPost: {
    title: 'DEAD SPACE',
    tag: 'FPS',
    description: 'La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento. Cada disparo cuenta, cada sombra es una amenaza.',
  },

  // LISTA DE LOS 4 POSTS
  posts: [
    {
      id: 'p1',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorDisplayName: 'JORGE SILVA',
      authorUsername: 'jorgetech',
      author_profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
      postTitle: 'DEAD SPACE',
      content: 'La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento. Cada disparo cuenta, cada sombra es una amenaza.',
      media: { images: ['https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg'], hashtags: ['#SurvivalHorror', '#DeadSpace'] },
      is_review: false,
      review_score: null,
      reviewed_game: '',
      likes_counter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', author_id: 'user1', authorDisplayName: 'Isaac Clarke', author_profilePic: 'https://i.pravatar.cc/150?u=isaac', content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', author_id: 'user2', authorDisplayName: 'Nicole Brennan', author_profilePic: 'https://i.pravatar.cc/150?u=nicole', content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-01',
      last_modified_at: '2024-06-01',
      deletedAt: null,
    },
    {
      id: 'p2',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorDisplayName: 'JORGE SILVA',
      authorUsername: 'jorgetech',
      author_profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
      postTitle: 'RESIDENT EVIL 4',
      content: 'Leon S. Kennedy se enfrenta a una pesadilla en la España rural. El equilibrio perfecto entre terror y acción.',
      media: { images: ['https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg'], hashtags: ['#ResidentEvil', '#Terror'] },
      is_review: false,
      review_score: null,
      reviewed_game: '',
      likes_counter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', author_id: 'user1', authorDisplayName: 'Isaac Clarke', author_profilePic: 'https://i.pravatar.cc/150?u=isaac', content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', author_id: 'user2', authorDisplayName: 'Nicole Brennan', author_profilePic: 'https://i.pravatar.cc/150?u=nicole', content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-02',
      last_modified_at: '2024-06-02',
      deletedAt: null,
    },
    {
      id: 'p3',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorDisplayName: 'JORGE SILVA',
      authorUsername: 'jorgetech',
      author_profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
      postTitle: 'GEARS OF WAR 3',
      content: 'Acción frenética, coberturas y un modo horda que engancha. La historia de Marcus Fenix y su equipo llega a su mejor momento.',
      media: { images: ['https://th.bing.com/th/id/R.3d6d419d5e5c37b63d3c85ddd31be9d6?rik=YvTnKE9%2fOtsLpg&riu=http%3a%2f%2fimages.gamersyde.com%2fimage_gears_of_war_3-14855-2017_0001.jpg&ehk=O3C8u8EQi3blk%2faqiyRUWAD938a1H7TRgrnUfv%2bm5dg%3d&risl=&pid=ImgRaw&r=0'], hashtags: ['#GearsOfWar', '#TPS'] },
      is_review: false,
      review_score: null,
      reviewed_game: '',
      likes_counter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', author_id: 'user1', authorDisplayName: 'Isaac Clarke', author_profilePic: 'https://i.pravatar.cc/150?u=isaac', content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', author_id: 'user2', authorDisplayName: 'Nicole Brennan', author_profilePic: 'https://i.pravatar.cc/150?u=nicole', content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-03',
      last_modified_at: '2024-06-03',
      deletedAt: null,
    },
    {
      id: 'p4',
      author: '550e8400-e29b-41d4-a716-446655440000',
      authorDisplayName: 'JORGE SILVA',
      authorUsername: 'jorgetech',
      author_profilePic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
      postTitle: 'ELDEN RING',
      content: 'Explorando las Tierras Intermedias. La dificultad es elevada pero la recompensa visual y de descubrimiento no tiene comparación.',
      media: { images: ['https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-new-header-mobile.jpg'], hashtags: ['#EldenRing', '#SoulsLike'] },
      is_review: false,
      review_score: null,
      reviewed_game: '',
      likes_counter: 100,
      commentsCounter: 50,
      comments: [
        { id: 'c1', author_id: 'user1', authorDisplayName: 'Isaac Clarke', author_profilePic: 'https://i.pravatar.cc/150?u=isaac', content: '¡Esa armadura se ve genial!', createdAt: 'Hace 2 horas' },
        { id: 'c2', author_id: 'user2', authorDisplayName: 'Nicole Brennan', author_profilePic: 'https://i.pravatar.cc/150?u=nicole', content: 'Ten cuidado en la Ishimura...', createdAt: 'Hace 1 hora' }
      ],
      createdAt: '2024-06-04',
      last_modified_at: '2024-06-04',
      deletedAt: null,
    }
  ]
};