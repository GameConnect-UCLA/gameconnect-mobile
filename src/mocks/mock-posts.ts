import type { Post } from '@/src/core/types/post.types';

const FOTO_JORGE = 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg';

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: 'jorge-id',
    authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: FOTO_JORGE },
    title: 'DEAD SPACE',
    content: 'La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento. Cada disparo cuenta, cada sombra es una amenaza.',
    hashtags: ['FPS', 'Horror'],
    media: {
      urls: ['https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg'],
    },
    isReview: false,
    reviewedGame: 'Dead Space',
    likesCounter: 100,
    commentsCounter: 50,
    createdAt: '2024-05-19T10:00:00.000Z',
    lastModifiedAt: '2024-05-19T10:00:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: [
      {
        id: 'c1',
        authorUser: { displayName: 'Mariangel Perez', username: 'maripferres', profilePic: 'https://i.pravatar.cc/150?img=32' },
        content: '¡Este juego es increíble!',
        createdAt: 'Hace 5 min'
      },
      {
        id: 'c2',
        authorUser: { displayName: 'Carlos Mendoza', username: 'carlosgamer', profilePic: 'https://i.pravatar.cc/150?img=12' },
        content: '¿Es el remake o el original?',
        createdAt: 'Hace 2 min'
      }
    ]
  },
  {
    id: 'p2',
    author: '550e8400-e29b-41d4-a716-446655440000',
    authorUser: { displayName: 'Mariangel Perez', username: 'maripferres', profilePic: 'https://i.pravatar.cc/150?img=32' },
    title: '¡Cyberpunk 2077 es increíble ahora!',
    content:
      'Después de todas las actualizaciones, este juego se siente completamente diferente. La historia es absorbente y Night City luce mejor que nunca.',
    hashtags: ['RPG', 'OpenWorld', 'CyberPunk'],
    media: {
      urls: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
    },
    isReview: false,
    reviewedGame: 'Cyberpunk 2077',
    likesCounter: 182,
    commentsCounter: 24,
    createdAt: '2024-12-23T18:45:00.000Z',
    lastModifiedAt: '2024-12-23T18:45:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: [
      {
        id: 'c1',
        authorUser: { displayName: 'Carlos Mendoza', username: 'carlosgamer', profilePic: 'https://i.pravatar.cc/150?img=12' },
        content: '¡Cierto! Lo probé ayer y los glitches ya no existen.',
        createdAt: '2024-12-23T19:20:00.000Z'
      },
      {
        id: 'c2',
        authorUser: { displayName: 'MAXY3120', username: 'maxy3120', profilePic: 'https://i.pravatar.cc/150?img=56' },
        content: 'Totalmente de acuerdo, la inmersión ahora es de otro nivel.',
        createdAt: '2024-12-23T20:10:00.000Z'
      }
    ]
  },
  {
    id: 'p3',
    author: 'jorge-id',
    authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: FOTO_JORGE },
    title: 'RESIDENT EVIL 4',
    content: 'Leon S. Kennedy se enfrenta a una pesadilla en la España rural. El equilibrio perfecto entre terror y acción.',
    hashtags: ['Terror', 'Accion'],
    media: {
      urls: ['https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg'],
    },
    isReview: false,
    reviewedGame: 'Resident Evil 4',
    likesCounter: 120,
    commentsCounter: 30,
    createdAt: '2024-05-19T11:00:00.000Z',
    lastModifiedAt: '2024-05-19T11:00:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: [
      {
        id: 'c1',
        authorUser: { displayName: 'Carlos Mendoza', username: 'carlosgamer', profilePic: 'https://i.pravatar.cc/150?img=12' },
        content: '¡Cierto! Lo probé ayer y los glitches ya no existen.',
        createdAt: '2024-12-23T19:20:00.000Z'
      },
      {
        id: 'c2',
        authorUser: { displayName: 'MAXY3120', username: 'maxy3120', profilePic: 'https://i.pravatar.cc/150?img=56' },
        content: 'Totalmente de acuerdo, la inmersión ahora es de otro nivel.',
        createdAt: '2024-12-23T20:10:00.000Z'
      }
    ]
  },
  {
    id: 'p4',
    author: '550e8400-e29b-41d4-a716-446655440000',
    authorUser: { displayName: 'Carlos Mendoza', username: 'carlosgamer', profilePic: 'https://i.pravatar.cc/150?img=12' },
    title: 'Elden Ring: Un desafío épico',
    content:
      'FromSoftware lo hizo de nuevo. Este juego es difícil pero justo, y cada victoria se siente increíble.',
    hashtags: ['SoulsLike', 'RPG', 'BossFight'],
    media: {
      urls: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    isReview: false,
    reviewedGame: 'Elden Ring',
    likesCounter: 97,
    commentsCounter: 13,
    createdAt: '2025-05-08T13:12:00.000Z',
    lastModifiedAt: '2025-05-08T13:12:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: [
      {
        id: 'c3',
        authorUser: { displayName: 'Sofia Vega', username: 'sofiaves', profilePic: 'https://i.pravatar.cc/150?img=47' },
        content: '¿Cuánto tiempo te tomó vencer al primer Boss?',
        createdAt: '2025-05-08T14:00:00.000Z'
      }
    ]
  },
  {
    id: 'p5',
    author: 'jorge-id',
    authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: FOTO_JORGE },
    title: 'GEARS OF WAR 3',
    content: 'Acción frenética, coberturas y un modo horda que engancha. La historia de Marcus Fenix y su equipo llega a su mejor momento.',
    hashtags: ['Xbox', 'Shooter'],
    media: {
      urls: ['http://images.gamersyde.com/image_gears_of_war_3-14855-2017_0001.jpg'],
    },
    isReview: false,
    reviewedGame: 'Gears of War 3',
    likesCounter: 95,
    commentsCounter: 15,
    createdAt: '2024-05-19T12:00:00.000Z',
    lastModifiedAt: '2024-05-19T12:00:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: [
      {
        id: 'c1',
        authorUser: { displayName: 'Carlos Mendoza', username: 'carlosgamer', profilePic: 'https://i.pravatar.cc/150?img=12' },
        content: '¡Cierto! Lo probé ayer y los glitches ya no existen.',
        createdAt: '2024-12-23T19:20:00.000Z'
      },
      {
        id: 'c2',
        authorUser: { displayName: 'MAXY3120', username: 'maxy3120', profilePic: 'https://i.pravatar.cc/150?img=56' },
        content: 'Totalmente de acuerdo, la inmersión ahora es de otro nivel.',
        createdAt: '2024-12-23T20:10:00.000Z'
      }
    ]
  },
  {
    id: 'p6',
    author: '550e8400-e29b-41d4-a716-446655440000',
    authorUser: { displayName: 'Douriann', username: 'douriann', profilePic: 'https://i.pravatar.cc/150?u=douriann' },
    title: 'La mejor forma de volver a jugarlo',
    content:
      'Obra maestra. Estos sí son remakes, no como el proyecto vago de Naughty Dog.',
    hashtags: ['ResidentEvil', 'Review', 'SurvivalHorror'],
    media: {
      urls: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'],
    },
    isReview: true,
    reviewScore: 4,
    reviewedGame: 'Resident Evil 4',
    likesCounter: 100,
    commentsCounter: 50,
    createdAt: '2025-03-12T09:30:00.000Z',
    lastModifiedAt: '2025-03-12T09:30:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: [
      {
        id: 'c4',
        authorUser: { displayName: 'Ana Torres', username: 'anatgamer', profilePic: 'https://i.pravatar.cc/150?img=21' },
        content: 'La jugabilidad es una joya, Capcom se lució.',
        createdAt: '2025-03-12T10:30:00.000Z'
      }
    ]
  },
  {
    id: 'p7',
    author: 'jorge-id',
    authorUser: { displayName: 'JORGE SILVA', username: 'jorgetech', profilePic: FOTO_JORGE },
    title: 'ELDEN RING',
    content: 'Explorando las Tierras Intermedias. La dificultad es elevada pero la recompensa visual y de descubrimiento no tiene comparación.',
    hashtags: ['GOTY', 'Souls'],
    media: {
      urls: ['https://cdn.mos.cms.futurecdn.net/vVYdoxvuFkZMMBweq2iMUD-970-80.jpg'],
    },
    isReview: false,
    reviewedGame: 'Elden Ring',
    likesCounter: 250,
    commentsCounter: 80,
    createdAt: '2024-05-19T13:00:00.000Z',
    lastModifiedAt: '2024-05-19T13:00:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: []
  },
  {
    id: 'p8',
    author: '550e8400-e29b-41d4-a716-446655440000',
    authorUser: { displayName: 'MAXY3120', username: 'maxy3120', profilePic: 'https://i.pravatar.cc/150?img=56' },
    title: 'Resident Evil 4 se siente impecable',
    content:
      'Probablemente de los mejores remakes hasta la fecha y un ejemplo de cómo mejorar la experiencia original con un gameplay más dinámico.',
    hashtags: ['Review', 'Capcom', 'Horror'],
    media: {
      urls: [
        'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    isReview: true,
    reviewScore: 5,
    reviewedGame: 'Resident Evil 4',
    likesCounter: 214,
    commentsCounter: 68,
    createdAt: '2025-05-08T19:10:00.000Z',
    lastModifiedAt: '2025-05-08T19:10:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: []
  },
  {
    id: 'p9',
    author: '550e8400-e29b-41d4-a716-446655440000',
    authorUser: { displayName: 'Sofia Vega', username: 'sofiaves', profilePic: 'https://i.pravatar.cc/150?img=47' },
    title: 'Hoy solo vengo a decir que amo este soundtrack',
    content:
      'No siempre hace falta una review completa. A veces un juego solo te atrapa por su música, su dirección de arte y el ambiente que construye.',
    hashtags: ['Indie', 'Soundtrack', 'Atmosphere'],
    media: {
      urls: [],
    },
    isReview: false,
    reviewedGame: 'Hollow Knight',
    likesCounter: 53,
    commentsCounter: 8,
    createdAt: '2025-02-14T21:00:00.000Z',
    lastModifiedAt: '2025-02-14T21:00:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: [
      {
        id: 'c5',
        authorUser: { displayName: 'Mariangel Perez', username: 'maripferres', profilePic: 'https://i.pravatar.cc/150?img=32' },
        content: 'Christopher Larkin hizo un trabajo fenomenal en la música.',
        createdAt: '2025-02-14T22:15:00.000Z'
      }
    ]
  },
  {
    id: 'p10',
    author: '550e8400-e29b-41d4-a716-446655440000',
    authorUser: { displayName: 'Ana Torres', username: 'anatgamer', profilePic: 'https://i.pravatar.cc/150?img=21' },
    title: 'El nuevo parche arregló varios detalles del remake',
    content:
      'Capcom ajustó la cámara y la respuesta de los controles. El juego se siente más fino después de esta actualización.',
    hashtags: ['ResidentEvil4', 'Patch', 'Capcom'],
    media: {
      urls: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
    },
    isReview: false,
    reviewedGame: 'Resident Evil 4',
    likesCounter: 76,
    commentsCounter: 12,
    createdAt: '2025-05-10T16:20:00.000Z',
    lastModifiedAt: '2025-05-10T16:20:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: []
  },
  {
    id: 'p11',
    author: '550e8400-e29b-41d4-a716-446655440000',
    authorUser: { displayName: 'Javier Rojas', username: 'jvrojas', profilePic: 'https://i.pravatar.cc/150?img=15' },
    title: 'Así se ve el remake con varias capturas nuevas',
    content:
      'Compartieron más imágenes del parche y los cambios de iluminación se notan muchísimo. El juego quedó más limpio visualmente.',
    hashtags: ['ResidentEvil4', 'Screenshots', 'Patch'],
    media: {
      urls: [
        'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    isReview: false,
    reviewedGame: 'Resident Evil 4',
    likesCounter: 43,
    commentsCounter: 6,
    createdAt: '2025-05-11T10:05:00.000Z',
    lastModifiedAt: '2025-05-11T10:05:00.000Z',
    deletedAt: null,
    isRepost: false,
    originalPostId: '',
    comments: []
  },
];
