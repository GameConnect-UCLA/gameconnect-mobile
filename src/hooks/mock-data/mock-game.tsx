// data/mockGameProfiles.ts
import { GameProfile } from '../../types/game.types';

export const mockGameProfiles: GameProfile[] = [
  {
    id: 'g1',
    title: 'Elden Ring',
    developer: '@FromSoftware',
    cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    background_url: '../../assets/images/bgbody.png',
    rating_score: '4.9 / 5',
    rating_count: '(8.5k)',
    tags: ['RPG', 'Fantasía', 'Mundo Abierto'],
    description: 'Un RPG de acción épico ambientado en un vasto mundo diseñado por Hidetaka Miyazaki y George R.R. Martin. Explora las Tierras Intermedias y conviértete en el Señor del Círculo.',
    reviews: []
  },
  {
    id: 'g2',
    title: 'Hollow Knight',
    developer: '@TeamCherry',
    cover_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    background_url: '../../assets/images/bgbody.png',
    rating_score: '4.8 / 5',
    rating_count: '(3.2k)',
    tags: ['Metroidvania', 'Indie', 'Aventura'],
    description: 'Explora un vasto reino en ruinas de insectos y héroes en este premiado juego de acción y aventura 2D. Desciende a Hallownest y descubre sus secretos más oscuros.',
    reviews: []
  },
  {
    id: 'g3',
    title: 'Cyberpunk 2077',
    developer: '@CDProjektRed',
    cover_url: 'https://images.unsplash.com/photo-1593341643900-5477d9c36208',
    background_url: '../../assets/images/bgbody.png',
    rating_score: '4.2 / 5',
    rating_count: '(15k)',
    tags: ['Sci-Fi', 'Acción', 'Cyberpunk'],
    description: 'Night City es una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario en busca de un implante único que es la clave de la inmortalidad.',
    reviews: []
  },
  {
    id: 'g4',
    title: 'Stardew Valley',
    developer: '@ConcernedApe',
    cover_url: 'https://images.unsplash.com/photo-1589710391103-4f51a0290539',
    background_url: '../../assets/images/bgbody.png',
    rating_score: '5.0 / 5',
    rating_count: '(20k)',
    tags: ['Simulación', 'Indie', 'Relajante'],
    description: 'Has heredado la vieja granja de tu abuelo en Stardew Valley. Equipado con herramientas de mano y unas cuantas monedas, te propones comenzar tu nueva vida.',
    reviews: []
  },
  {
    id: 'g5',
    title: 'Resident Evil 4',
    developer: '@Capcom',
    cover_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
    background_url: '../../assets/images/bgbody.png',
    rating_score: '4.9 / 5',
    rating_count: '(11k)',
    tags: ['Horror', 'Acción', 'Remake'],
    description: 'Leon Kennedy regresa en un remake que moderniza la experiencia original sin perder su esencia. Intensidad, terror y acción perfectamente balanceados.',
    reviews: []
  }
];