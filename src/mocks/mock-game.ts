// data/mockGameProfiles.ts
import type { GameProfile } from '@/src/core/types/game.types';

export const mockGameProfiles: GameProfile[] = [
  {
    id: 'g1',
    title: 'Elden Ring',
    developer: '@FromSoftware',
    cover_url: 'https://cdn.mos.cms.futurecdn.net/vVYdoxvuFkZMMBweq2iMUD-970-80.jpg',
    background_url: '../../assets/images/bgbody.png',
    score: 49,
    rating_count: 8500,
    tags: ['RPG', 'Fantasía', 'Mundo Abierto'],
    description: 'Un RPG de acción épico ambientado en un vasto mundo diseñado por Hidetaka Miyazaki y George R.R. Martin. Explora las Tierras Intermedias y conviértete en el Señor del Círculo.',
    reviews: []
  },
  {
    id: 'g2',
    title: 'Dead Space',
    developer: '@TeamCherry',
    cover_url: 'https://cdn.wccftech.com/wp-content/uploads/2022/12/WCCFdeadspaceremake8.jpg',
    background_url: '../../assets/images/bgbody.png',
    score: 48,
    rating_count: 5000,
    tags: ['Horror', 'Supervivencia', 'Sci-Fi'],
    description: 'Horror y supervivencia en el espacio. La tensión y el ambiente opresivo del USG Ishimura te mantendrán al borde del asiento.',
    reviews: []
  },
  {
    id: 'g3',
    title: 'Cyberpunk 2077',
    developer: '@CDProjektRed',
    cover_url: 'https://tse1.mm.bing.net/th/id/OIP.6R3EKvjrTgZ1pHKtlhnLXAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
    background_url: '../../assets/images/bgbody.png',
    score: 42,
    rating_count: 15000,
    tags: ['Sci-Fi', 'Acción', 'Cyberpunk'],
    description: 'Night City es una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario en busca de un implante único que es la clave de la inmortalidad.',
    reviews: []
  },
  {
    id: 'g4',
    title: 'Stardew Valley',
    developer: '@ConcernedApe',
    cover_url: 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/06/Stardew-Valley-Four-Corners-Layout.jpg',
    background_url: '../../assets/images/bgbody.png',
    score: 50,
    rating_count: 20000,
    tags: ['Simulación', 'Indie', 'Relajante'],
    description: 'Has heredado la vieja granja de tu abuelo en Stardew Valley. Equipado con herramientas de mano y unas cuantas monedas, te propones comenzar tu nueva vida.',
    reviews: []
  },
  {
    id: 'g5',
    title: 'Resident Evil 4',
    developer: '@Capcom',
    cover_url: 'https://images7.alphacoders.com/130/thumb-1920-1306926.jpeg',
    background_url: '../../assets/images/bgbody.png',
    score: 49,
    rating_count: 11000,
    tags: ['Horror', 'Acción', 'Remake'],
    description: 'Leon Kennedy regresa en un remake que moderniza la experiencia original sin perder su esencia. Intensidad, terror y acción perfectamente balanceados.',
    reviews: []
  },
  {
    id: 'g6',
    title: 'Gears Of War 3',
    developer: '@EpicGames',
    cover_url: 'https://th.bing.com/th/id/R.3d6d419d5e5c37b63d3c85ddd31be9d6?rik=YvTnKE9%2fOtsLpg&riu=http%3a%2f%2fimages.gamersyde.com%2fimage_gears_of_war_3-14855-2017_0001.jpg&ehk=O3C8u8EQi3blk%2faqiyRUWAD938a1H7TRgrnUfv%2bm5dg%3d&risl=&pid=ImgRaw&r=0',
    background_url: '../../assets/images/bgbody.png',
    score: 47,
    rating_count: 12000,
    tags: ['Shooter', 'Acción'],
    description: 'El épico cierre de la trilogía original de Gears of War.',
    reviews: []
  },
  {
    id: 'g7',
    title: 'Valorant',
    developer: '@RiotGames',
    cover_url: 'https://jetex.id/blog/wp-content/uploads/2023/11/Tips-Memilih-Agent-Valorant-1-1024x538.jpg',
    background_url: '../../assets/images/bgbody.png',
    score: 45,
    rating_count: 50000,
    tags: ['Táctico', 'Competitivo', 'FPS'],
    description: 'Shooter táctico 5v5 con personajes únicos.',
    reviews: []
  },
  {
    id: 'g8',
    title: 'Doom: The Dark Ages',
    developer: '@idSoftware',
    cover_url: 'https://cdn.wccftech.com/wp-content/uploads/2025/01/DOOM-TheDarkAges_Standard_1920x1080-HD-scaled.jpeg',
    background_url: '../../assets/images/bgbody.png',
    score: 50,
    rating_count: 0,
    tags: ['Acción', 'Brutal', 'FPS'],
    description: 'La precuela cinematográfica de los aclamados DOOM.',
    reviews: []
  },
  {
    id: 'g9',
    title: 'Counter-Strike 2',
    developer: '@Valve',
    cover_url: 'https://cdn.mos.cms.futurecdn.net/8aNDCyui6ac33jDZKXKFsW.jpg',
    background_url: '../../assets/images/bgbody.png',
    score: 44,
    rating_count: 100000,
    tags: ['FPS', 'Competitivo'],
    description: 'La evolución del juego de acción en primera persona más jugado del mundo.',
    reviews: []
  },
  {
    id: 'g10',
    title: 'Hunt: Showdown',
    developer: '@Crytek',
    cover_url: 'https://gameriv.com/wp-content/uploads/2026/04/Hunt-Showdown-leaving-Xbox-Game-Pass.jpg',
    background_url: '../../assets/images/bgbody.png',
    score: 46,
    rating_count: 4000,
    tags: ['PvPvE', 'Supervivencia'],
    description: 'Caza monstruos de pesadilla en el pantano de Luisiana.',
    reviews: []
  }
];

