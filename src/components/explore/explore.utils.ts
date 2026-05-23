import type { Post } from '@/src/types/post.types';

export type FilterKey = 'todo' | 'gamers' | 'posts' | 'juegos' | 'tags';

export type ExploreChip = {
  key: FilterKey;
  label: string;
  icon:
    | 'grid-outline'
    | 'people-outline'
    | 'document-text-outline'
    | 'game-controller-outline'
    | 'pricetag-outline';
};

export type FeaturedPlayer = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: number;
};

export const FILTERS: ExploreChip[] = [
  { key: 'todo', label: 'TODO', icon: 'grid-outline' },
  { key: 'gamers', label: 'GAMERS', icon: 'people-outline' },
  { key: 'posts', label: 'POSTS', icon: 'document-text-outline' },
  { key: 'juegos', label: 'JUEGOS', icon: 'game-controller-outline' },
  { key: 'tags', label: '# TAGS', icon: 'pricetag-outline' },
];

export const INITIAL_VISIBLE_POSTS = 3;

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function buildTrendLabel(source: string) {
  return `#${source.replace(/\s+/g, '')}`;
}

export function getLevelFromPosts(authorPosts: number, totalLikes: number) {
  return Math.min(99, 25 + authorPosts * 8 + Math.round(totalLikes / 40));
}

export function matchesActiveFilter(post: Post, activeFilter: FilterKey) {
  switch (activeFilter) {
    case 'gamers':
      return post.is_review;
    case 'posts':
      return !post.is_review;
    case 'juegos':
      return post.reviewed_game.length > 0;
    case 'tags':
      return post.media.hashtags.length > 0;
    default:
      return true;
  }
}
