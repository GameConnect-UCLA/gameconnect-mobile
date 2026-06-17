import type { User } from '@/src/core/types/user.types'
import { UserRole, UserState } from '@/src/core/types/user.types'

export function normalizeUser(apiUser: Record<string, unknown>): User {
  return {
    id: (apiUser.id as string) ?? '',
    display_name: (apiUser.displayName ?? apiUser.display_name ?? '') as string,
    username: (apiUser.username as string) ?? '',
    role: (apiUser.role as UserRole) ?? UserRole.USER,
    email: (apiUser.email as string) ?? '',
    bio: apiUser.bio as string | undefined,
    pronouns: apiUser.pronouns as string | undefined,
    birth_date: ((apiUser.birthDate ?? apiUser.birth_date) as string) ?? undefined,
    account_settings: (apiUser.accountSettings ?? apiUser.account_settings ?? {}) as Record<string, unknown>,
    profile_pic: (apiUser.profilePic ?? apiUser.profile_pic ?? '') as string,
    cover_pic: (apiUser.coverPic ?? apiUser.cover_pic ?? '') as string,
    stats: (apiUser.stats ?? { posts: 0, followers: 0, following: 0 }) as User['stats'],
    favorite_games: (apiUser.favoriteGames ?? apiUser.favorite_games ?? []) as User['favorite_games'],
    featured_post: (apiUser.featuredPost ?? apiUser.featured_post ?? null) as User['featured_post'],
    state: (apiUser.state as UserState) ?? UserState.ACTIVE,
    banned_at: (apiUser.bannedAt ?? apiUser.banned_at) as string | null | undefined,
    ban_reason: (apiUser.banReason ?? apiUser.ban_reason) as string | null | undefined,
    created_at: (apiUser.createdAt ?? apiUser.created_at ?? new Date().toISOString()) as string,
    deleted_at: (apiUser.deletedAt ?? apiUser.deleted_at) as string | null | undefined,
    verified: (apiUser.verified as boolean) ?? false,
    posts: (apiUser.posts ?? []) as User['posts'],
  }
}
