import { create } from 'zustand';

import { mockPosts } from '@/src/hooks/mock-data/mock-posts';
import type { Post } from '@/src/types/post.types';

type PostState = {
  posts: Post[];
  favoriteIds: string[]; // guarda solo los IDs favoritos
  lastAddedId?: string;
  addPost: (post: Post) => void;
  reloadPosts: () => void;

  // Colocar/quitar favoritos
  toggleFavorite: (postId: string) => void; 
};

const clonePost = (post: Post): Post => ({
  ...post,
  media: {
    images: [...post.media.images],
    hashtags: [...post.media.hashtags],
  },
  comments: post.comments ? post.comments.map(c => ({ ...c })) : [],
});

const getInitialPosts = () => mockPosts.map(clonePost);

export const usePostStore = create<PostState>((set) => ({
  posts: getInitialPosts(),
  favoriteIds: [], 
  lastAddedId: undefined,

  addPost: (post) =>
    set((state) => ({
      posts: [clonePost(post), ...state.posts],
      lastAddedId: post.id,
    })),

  reloadPosts: () => set(() => ({ posts: getInitialPosts() })),

  // Si hay un favorito lo quita, de lo contrario lo agrega
  toggleFavorite: (postId) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(postId)
        ? state.favoriteIds.filter((id) => id !== postId) // Se elimina
        : [...state.favoriteIds, postId], // Se agrega
    })),
}));