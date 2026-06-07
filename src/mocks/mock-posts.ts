import type { Post } from '@/src/core/types/post.types';

const FOTO_JORGE = 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg';

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: 'jorge-id',
    author_display_name: 'JORGE SILVA',
    author_username: 'jorgetech',
    author_profile_pic: FOTO_JORGE,
    post_title: 'DEAD SPACE',
    content: 'La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento. Cada disparo cuenta, cada sombra es una amenaza.',
    media: {
      images: ['https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg'],
      hashtags: ['FPS', 'Horror'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Dead Space',
    likes_counter: 100,
    comments_counter: 50,
    created_at: '2024-05-19T10:00:00.000Z',
    last_modified_at: '2024-05-19T10:00:00.000Z',
    deleted_at: null,
    comments: [
      { 
        id: 'c1', 
        author_id: '550e8400-e29b-41d4-a716-446655440000',
        author_display_name: 'Mariangel Perez', 
        author_profile_pic: 'https://i.pravatar.cc/150?img=32', 
        content: '¡Este juego es increíble!', 
        created_at: 'Hace 5 min'
      },
      { 
        id: 'c2', 
        author_id: 'carlos-id', // ID de Carlos
        author_display_name: 'Carlos Mendoza', 
        author_profile_pic: 'https://i.pravatar.cc/150?img=12', 
        content: '¿Es el remake o el original?', 
        created_at: 'Hace 2 min' 
      }
    ]
  },
  {
    id: 'p2',
    author: '550e8400-e29b-41d4-a716-446655440000',
    author_display_name: 'Mariangel Perez',
    author_username: 'maripferres',
    author_profile_pic: 'https://i.pravatar.cc/150?img=32',
    post_title: '¡Cyberpunk 2077 es increíble ahora!',
    content:
      'Después de todas las actualizaciones, este juego se siente completamente diferente. La historia es absorbente y Night City luce mejor que nunca.',
    media: {
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
      hashtags: ['RPG', 'OpenWorld', 'CyberPunk'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Cyberpunk 2077',
    likes_counter: 182,
    comments_counter: 24,
    created_at: '2024-12-23T18:45:00.000Z',
    last_modified_at: '2024-12-23T18:45:00.000Z',
    deleted_at: null,
    comments: [
      {
        id: 'c1',
        author_id: 'carlos-id',
        author_display_name: 'Carlos Mendoza',
        author_profile_pic: 'https://i.pravatar.cc/150?img=12',
        content: '¡Cierto! Lo probé ayer y los glitches ya no existen.',
        created_at: '2024-12-23T19:20:00.000Z'
      },
      {
        id: 'c2',
        author_id: 'maxy-id',
        author_display_name: 'MAXY3120',
        author_profile_pic: 'https://i.pravatar.cc/150?img=56',
        content: 'Totalmente de acuerdo, la inmersión ahora es de otro nivel.',
        created_at: '2024-12-23T20:10:00.000Z'
      }
    ]
  },
  {
    id: 'p3',
    author: 'jorge-id',
    author_display_name: 'JORGE SILVA',
    author_username: 'jorgetech',
    author_profile_pic: FOTO_JORGE,
    post_title: 'RESIDENT EVIL 4',
    content: 'Leon S. Kennedy se enfrenta a una pesadilla en la España rural. El equilibrio perfecto entre terror y acción.',
    media: {
      images: ['https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg'],
      hashtags: ['Terror', 'Accion'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Resident Evil 4',
    likes_counter: 120,
    comments_counter: 30,
    created_at: '2024-05-19T11:00:00.000Z',
    last_modified_at: '2024-05-19T11:00:00.000Z',
    deleted_at: null,
    comments: [
      {
        id: 'c1',
        author_id: 'carlos-id',
        author_display_name: 'Carlos Mendoza',
        author_profile_pic: 'https://i.pravatar.cc/150?img=12',
        content: '¡Cierto! Lo probé ayer y los glitches ya no existen.',
        created_at: '2024-12-23T19:20:00.000Z'
      },
      {
        id: 'c2',
        author_id: 'maxy-id',
        author_display_name: 'MAXY3120',
        author_profile_pic: 'https://i.pravatar.cc/150?img=56',
        content: 'Totalmente de acuerdo, la inmersión ahora es de otro nivel.',
        created_at: '2024-12-23T20:10:00.000Z'
      }
    ]
  },
  {
    id: 'p4',
    author: '550e8400-e29b-41d4-a716-446655440000',
    author_display_name: 'Carlos Mendoza',
    author_username: 'carlosgamer',
    author_profile_pic: 'https://i.pravatar.cc/150?img=12',
    post_title: 'Elden Ring: Un desafío épico',
    content:
      'FromSoftware lo hizo de nuevo. Este juego es difícil pero justo, y cada victoria se siente increíble.',
    media: {
      images: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80',
      ],
      hashtags: ['SoulsLike', 'RPG', 'BossFight'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Elden Ring',
    likes_counter: 97,
    comments_counter: 13,
    created_at: '2025-05-08T13:12:00.000Z',
    last_modified_at: '2025-05-08T13:12:00.000Z',
    deleted_at: null,
    comments: [
      {
        id: 'c3',
        author_id: 'sofia-id',
        author_display_name: 'Sofia Vega',
        author_profile_pic: 'https://i.pravatar.cc/150?img=47',
        content: '¿Cuánto tiempo te tomó vencer al primer Boss?',
        created_at: '2025-05-08T14:00:00.000Z'
      }
    ]
  },
  {
    id: 'p5',
    author: 'jorge-id',
    author_display_name: 'JORGE SILVA',
    author_username: 'jorgetech',
    author_profile_pic: FOTO_JORGE,
    post_title: 'GEARS OF WAR 3',
    content: 'Acción frenética, coberturas y un modo horda que engancha. La historia de Marcus Fenix y su equipo llega a su mejor momento.',
    media: {
      images: ['http://images.gamersyde.com/image_gears_of_war_3-14855-2017_0001.jpg'],
      hashtags: ['Xbox', 'Shooter'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Gears of War 3',
    likes_counter: 95,
    comments_counter: 15,
    created_at: '2024-05-19T12:00:00.000Z',
    last_modified_at: '2024-05-19T12:00:00.000Z',
    deleted_at: null,
    comments: [
      {
        id: 'c1',
        author_id: 'carlos-id',
        author_display_name: 'Carlos Mendoza',
        author_profile_pic: 'https://i.pravatar.cc/150?img=12',
        content: '¡Cierto! Lo probé ayer y los glitches ya no existen.',
        created_at: '2024-12-23T19:20:00.000Z'
      },
      {
        id: 'c2',
        author_id: 'maxy-id',
        author_display_name: 'MAXY3120',
        author_profile_pic: 'https://i.pravatar.cc/150?img=56',
        content: 'Totalmente de acuerdo, la inmersión ahora es de otro nivel.',
        created_at: '2024-12-23T20:10:00.000Z'
      }
    ]
  },
  {
    id: 'p6',
    author: '550e8400-e29b-41d4-a716-446655440000',
    author_display_name: 'Douriann',
    author_username: 'douriann',
    author_profile_pic: 'https://i.pravatar.cc/150?u=douriann',
    post_title: 'La mejor forma de volver a jugarlo',
    content:
      'Obra maestra. Estos sí son remakes, no como el proyecto vago de Naughty Dog.',
    media: {
      images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'],
      hashtags: ['ResidentEvil', 'Review', 'SurvivalHorror'],
    },
    is_review: true,
    review_score: 4,
    reviewed_game: 'Resident Evil 4',
    likes_counter: 100,
    comments_counter: 50,
    created_at: '2025-03-12T09:30:00.000Z',
    last_modified_at: '2025-03-12T09:30:00.000Z',
    deleted_at: null,
    comments: [
      {
        id: 'c4',
        author_id: 'ana-id',
        author_display_name: 'Ana Torres',
        author_profile_pic: 'https://i.pravatar.cc/150?img=21',
        content: 'La jugabilidad es una joya, Capcom se lució.',
        created_at: '2025-03-12T10:30:00.000Z'
      }
    ]
  },
  {
    id: 'p7',
    author: 'jorge-id',
    author_display_name: 'JORGE SILVA',
    author_username: 'jorgetech',
    author_profile_pic: FOTO_JORGE,
    post_title: 'ELDEN RING',
    content: 'Explorando las Tierras Intermedias. La dificultad es elevada pero la recompensa visual y de descubrimiento no tiene comparación.',
    media: {
      images: ['https://cdn.mos.cms.futurecdn.net/vVYdoxvuFkZMMBweq2iMUD-970-80.jpg'],
      hashtags: ['GOTY', 'Souls'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Elden Ring',
    likes_counter: 250,
    comments_counter: 80,
    created_at: '2024-05-19T13:00:00.000Z',
    last_modified_at: '2024-05-19T13:00:00.000Z',
    deleted_at: null,
    comments: []
  },
  {
    id: 'p8',
    author: '550e8400-e29b-41d4-a716-446655440000',
    author_display_name: 'MAXY3120',
    author_username: 'maxy3120',
    author_profile_pic: 'https://i.pravatar.cc/150?img=56',
    post_title: 'Resident Evil 4 se siente impecable',
    content:
      'Probablemente de los mejores remakes hasta la fecha y un ejemplo de cómo mejorar la experiencia original con un gameplay más dinámico.',
    media: {
      images: [
        'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
      ],
      hashtags: ['Review', 'Capcom', 'Horror'],
    },
    is_review: true,
    review_score: 5,
    reviewed_game: 'Resident Evil 4',
    likes_counter: 214,
    comments_counter: 68,
    created_at: '2025-05-08T19:10:00.000Z',
    last_modified_at: '2025-05-08T19:10:00.000Z',
    deleted_at: null,
    comments: []
  },
  {
    id: 'p9',
    author: '550e8400-e29b-41d4-a716-446655440000',
    author_display_name: 'Sofia Vega',
    author_username: 'sofiaves',
    author_profile_pic: 'https://i.pravatar.cc/150?img=47',
    post_title: 'Hoy solo vengo a decir que amo este soundtrack',
    content:
      'No siempre hace falta una review completa. A veces un juego solo te atrapa por su música, su dirección de arte y el ambiente que construye.',
    media: {
      images: [],
      hashtags: ['Indie', 'Soundtrack', 'Atmosphere'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Hollow Knight',
    likes_counter: 53,
    comments_counter: 8,
    created_at: '2025-02-14T21:00:00.000Z',
    last_modified_at: '2025-02-14T21:00:00.000Z',
    deleted_at: null,
    comments: [
      {
        id: 'c5',
        author_id: '550e8400-e29b-41d4-a716-446655440000',
        author_display_name: 'Mariangel Perez',
        author_profile_pic: 'https://i.pravatar.cc/150?img=32',
        content: 'Christopher Larkin hizo un trabajo fenomenal en la música.',
        created_at: '2025-02-14T22:15:00.000Z'
      }
    ]
  },
  {
    id: 'p10',
    author: '550e8400-e29b-41d4-a716-446655440000',
    author_display_name: 'Ana Torres',
    author_username: 'anatgamer',
    author_profile_pic: 'https://i.pravatar.cc/150?img=21',
    post_title: 'El nuevo parche arregló varios detalles del remake',
    content:
      'Capcom adjusted the camera and the response of the controls. El juego se siente más fino después de esta actualización.',
    media: {
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
      hashtags: ['ResidentEvil4', 'Patch', 'Capcom'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Resident Evil 4',
    likes_counter: 76,
    comments_counter: 12,
    created_at: '2025-05-10T16:20:00.000Z',
    last_modified_at: '2025-05-10T16:20:00.000Z',
    deleted_at: null,
    comments: []
  },
  {
    id: 'p11',
    author: '550e8400-e29b-41d4-a716-446655440000',
    author_display_name: 'Javier Rojas',
    author_username: 'jvrojas',
    author_profile_pic: 'https://i.pravatar.cc/150?img=15',
    post_title: 'Así se ve el remake con varias capturas nuevas',
    content:
      'Compartieron más imágenes del parche y los cambios de iluminación se notan muchísimo. El juego quedó más limpio visualmente.',
    media: {
      images: [
        'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      ],
      hashtags: ['ResidentEvil4', 'Screenshots', 'Patch'],
    },
    is_review: false,
    review_score: null,
    reviewed_game: 'Resident Evil 4',
    likes_counter: 43,
    comments_counter: 6,
    created_at: '2025-05-11T10:05:00.000Z',
    last_modified_at: '2025-05-11T10:05:00.000Z',
    deleted_at: null,
    comments: []
  },
];