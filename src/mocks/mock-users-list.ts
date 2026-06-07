import { mockFavoriteGames } from './mock-favorite-games';
export const mockUsersList = [
    {
      id: 'jorge-id',
      display_name: 'Jorge Silva',
      username: 'jorgetech',
      profile_pic: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/94865395-9e45-4e4b-9f4f-fac723fbf713.__CR0,0,362,453_PT0_SX362_V1___.jpg',
      cover_pic: 'https://static.wikia.nocookie.net/videojuego/images/7/7c/Tomb_Raider_acci%C3%B3n.jpg/revision/latest/scale-to-width-down/1200?cb=20180616142353',
      bio: 'Gamer Profesional | Streamer | Amante de los FPS',
      favorite_games: mockFavoriteGames,
      stats: { posts: 4, followers: 20, following: 10 }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      display_name: 'Mariangel Perez',
      username: 'maripferres',
      profile_pic: 'https://i.pravatar.cc/150?img=32',
      cover_pic: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      bio: 'RPG Fan | Diseñadora de niveles | Cyberpunk lover 🤖',
      stats: { posts: 2, followers: 150, following: 85 }
    },
    {
      id: 'carlos-id',
      display_name: 'Carlos Mendoza',
      username: 'carlosgamer',
      profile_pic: 'https://i.pravatar.cc/150?img=12',
      cover_pic: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
      bio: 'Souls-like addict | No pain no gain | Let me solo her',
      stats: { posts: 2, followers: 500, following: 300 }
    }
  ];