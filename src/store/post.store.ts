import { create } from 'zustand';

import { mockPosts } from '@/src/hooks/mock-data/mock-posts';
import type { Post } from '@/src/types/post.types';

type PostState = {
  posts: Post[];
  lastAddedId?: string;
  addPost: (post: Post) => void;
  reloadPosts: () => void;
};

const clonePost = (post: Post): Post => ({
  ...post,
  media: {
    images: [...post.media.images],
    hashtags: [...post.media.hashtags],
  },
});

const getInitialPosts = () => mockPosts.map(clonePost);

export const usePostStore = create<PostState>((set) => ({
  posts: getInitialPosts(),
  lastAddedId: undefined,
  addPost: (post) =>
    set((state) => ({
      posts: [clonePost(post), ...state.posts],
      lastAddedId: post.id,
    })),
  reloadPosts: () => set(() => ({ posts: getInitialPosts() })),
}));