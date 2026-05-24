import { User, UserRole, UserState } from '../../types/user.types';

export const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  display_name: 'JORGE SILVA',
  username: 'jorgetech',
  role: UserRole.USER,
  email: 'jorgetech@gmail.com',
  bio: 'Gamer Profesional\nStreamer\nAmante de los FPS y MOBA',
  birth_date: '1995-05-15',
  
  // Configuración de cuenta
  account_settings: {
    theme: 'dark',
    notifications: true,
  },

  // Imágenes de Perfil y Portada
  profile_pic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
  cover_pic: 'https://static.wikia.nocookie.net/videojuego/images/7/7c/Tomb_Raider_acci%C3%B3n.jpg/revision/latest/scale-to-width-down/1200?cb=20180616142353',

  // Estado de la cuenta
  state: UserState.ACTIVE,
  verified: true,
  created_at: 'Diciembre 2023',
  banned_at: null,
  ban_reason: null,
  deleted_at: null,

  // Estadísticas del perfil
  stats: {
    posts: 22,
    followers: 20,
    following: 10,
  },

  // Juegos Favoritos
  favorite_games: [
    {
      id: '1',
      name: 'Dead Space',
      image_url: 'https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg',
      description: 'Horror y supervivencia en el espacio. La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento.'
    },
    {
      id: '2',
      name: 'Resident Evil 4',
      image_url: 'https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg',
      description: 'El clásico de acción y terror que revolucionó la saga. Defiende a Ashley y vive una experiencia llena de disparos.'
    },
    {
      id: '3',
      name: 'Gears Of War 3',
      image_url: 'https://th.bing.com/th/id/R.3d6d419d5e5c37b63d3c85ddd31be9d6?rik=YvTnKE9%2fOtsLpg&riu=http%3a%2f%2fimages.gamersyde.com%2fimage_gears_of_war_3-14855-2017_0001.jpg&ehk=O3C8u8EQi3blk%2faqiyRUWAD938a1H7TRgrnUfv%2bm5dg%3d&risl=&pid=ImgRaw&r=0',
      description: 'El épico cierre de la trilogía original. Acción frenética en coberturas y un modo horda que engancha.'
    },
  ],

  // Post destacado
  featured_post: {
    title: 'DEAD SPACE',
    tag: 'FPS',
    description: 'La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento. Cada disparo cuenta, cada sombra es una amenaza.',
  },

  // LISTA DE LOS 4 POSTS
  posts: [
    {
      id: 'p1',
      title: 'DEAD SPACE',
      content: 'La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento. Cada disparo cuenta, cada sombra es una amenaza.',
      imageUrl: 'https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg',
      likes: 100,
      comments: 50,
      commentsList: [
        { id: 'c1', userName: 'Isaac Clarke', userAvatar: 'https://i.pravatar.cc/150?u=isaac', text: '¡Esa armadura se ve genial!', date: 'Hace 2 horas' },
        { id: 'c2', userName: 'Nicole Brennan', userAvatar: 'https://i.pravatar.cc/150?u=nicole', text: 'Ten cuidado en la Ishimura...', date: 'Hace 1 hora' }
      ]
    },
    {
      id: 'p2',
      title: 'RESIDENT EVIL 4',
      content: 'Leon S. Kennedy se enfrenta a una pesadilla en la España rural. El equilibrio perfecto entre terror y acción.',
      imageUrl: 'https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg',
      likes: 100,
      comments: 50,
      commentsList: [
        { id: 'c1', userName: 'Isaac Clarke', userAvatar: 'https://i.pravatar.cc/150?u=isaac', text: '¡Esa armadura se ve genial!', date: 'Hace 2 horas' },
        { id: 'c2', userName: 'Nicole Brennan', userAvatar: 'https://i.pravatar.cc/150?u=nicole', text: 'Ten cuidado en la Ishimura...', date: 'Hace 1 hora' }
      ]
    },
    {
      id: 'p3',
      title: 'GEARS OF WAR 3',
      content: 'Acción frenética, coberturas y un modo horda que engancha. La historia de Marcus Fenix y su equipo llega a su mejor momento.',
      imageUrl: 'https://th.bing.com/th/id/R.3d6d419d5e5c37b63d3c85ddd31be9d6?rik=YvTnKE9%2fOtsLpg&riu=http%3a%2f%2fimages.gamersyde.com%2fimage_gears_of_war_3-14855-2017_0001.jpg&ehk=O3C8u8EQi3blk%2faqiyRUWAD938a1H7TRgrnUfv%2bm5dg%3d&risl=&pid=ImgRaw&r=0',
      likes: 100,
      comments: 50,
      commentsList: [
        { id: 'c1', userName: 'Isaac Clarke', userAvatar: 'https://i.pravatar.cc/150?u=isaac', text: '¡Esa armadura se ve genial!', date: 'Hace 2 horas' },
        { id: 'c2', userName: 'Nicole Brennan', userAvatar: 'https://i.pravatar.cc/150?u=nicole', text: 'Ten cuidado en la Ishimura...', date: 'Hace 1 hora' }
      ]
    },
    {
      id: 'p4',
      title: 'ELDEN RING',
      content: 'Explorando las Tierras Intermedias. La dificultad es elevada pero la recompensa visual y de descubrimiento no tiene comparación.',
      imageUrl: 'https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-new-header-mobile.jpg',
      likes: 100,
      comments: 50,
      commentsList: [
        { id: 'c1', userName: 'Isaac Clarke', userAvatar: 'https://i.pravatar.cc/150?u=isaac', text: '¡Esa armadura se ve genial!', date: 'Hace 2 horas' },
        { id: 'c2', userName: 'Nicole Brennan', userAvatar: 'https://i.pravatar.cc/150?u=nicole', text: 'Ten cuidado en la Ishimura...', date: 'Hace 1 hora' }
      ]
    }
  ]
};