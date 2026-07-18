# Schema Gaps — Frontend Fields Missing from DB Schema

> **Date:** 2026-06-07  
> **Scope:** Fields and enums used by the mobile frontend but absent from `docs/dbschema.md`.  
> **Action:** Backend dev adds these to the NestJS schema (TypeORM / MikroORM entities + migrations).

---

## User Table

### New Columns

| Field | Frontend Type | Purpose | DDL |
|-------|--------------|---------|-----|
| `displayName` | `string` | Display name separate from `username`. User everywhere in UI (post headers, chat, profile header). | `ALTER TABLE "user" ADD COLUMN displayName varchar(50);` |
| `pronouns` | `string?` | Display pronouns on profile (e.g. "he/him", "she/her", "they/them"). | `ALTER TABLE "user" ADD COLUMN pronouns varchar(20);` |
| `coverPic` | `string` | Profile cover/header image URL. Stored in Cloudinary like `profilePic`. | `ALTER TABLE "user" ADD COLUMN coverPic text;` |
| `verified` | `boolean` | Verified badge on profile. Staff or manual flag. | `ALTER TABLE "user" ADD COLUMN verified bool DEFAULT false;` |

### Enum Changes

| Issue | Frontend | DB | Fix |
|-------|----------|----|-----|
| Missing role | `UserRole.ADMIN` exists | `USER_ROLE` enum has only `USER`, `MODERATOR` | `ALTER TYPE user_role ADD VALUE 'ADMIN';` |
| Missing state | `UserState.BANNED` exists | `USER_STATE` enum has only `ACTIVE`, `TO_DELETE`; `bannedAt` column exists but no state value | `ALTER TYPE user_state ADD VALUE 'BANNED';` |
| Missing state | `UserState.INACTIVE` exists | `USER_STATE` enum missing `INACTIVE` | `ALTER TYPE user_state ADD VALUE 'INACTIVE';` |

---

## Post Table

### New Columns

| Field | Frontend Type | Purpose | DDL |
|-------|--------------|---------|-----|
| `postTitle` | `string` | Post/review title. Currently the frontend `Post` type has a `postTitle` field that doesn't exist in the DB. `content` is separate. | `ALTER TABLE "post" ADD COLUMN title varchar(150);` |
| `review_score` | `number \| null` | Score for review posts. DB `game.score` holds aggregate game score; this is the individual reviewer's score. | `ALTER TABLE "post" ADD COLUMN review_score smallint;` |

### Column Alignments Needed

| Field | Frontend Issue | Fix |
|-------|---------------|-----|
| `reviewed_game` | Frontend types it as `string` (game name text). DB has `reviewed_game uuid` (FK to `game.id`). | API response should include `reviewed_game` (UUID) + `reviewed_game_title` (string for display). Keep DB as UUID FK, add resolver for title. |
| `hashtags` | Frontend `PostMedia.hashtags` stores hashtags. DB `post.media` jsonb is for image URLs only. | Option A: `ALTER TABLE "post" ADD COLUMN hashtags text[];` Option B: Include `hashtags` in `media` jsonb key. Pick one. |

### Typo Fixes in Frontend

| Current | Correct | File |
|---------|---------|------|
| `autor` | `author` | `src/types/post.types.ts` |
| `commets_counter` | `commentsCounter` | `src/types/post.types.ts` |

---

## Notification Table

### New Columns

| Field | Frontend Type | Purpose | DDL |
|-------|--------------|---------|-----|
| `createdAt` | `string` (frontend uses `createdAt`) | Notification timestamp. DB `notification` table has no timestamp column. Required for ordering. | `ALTER TABLE "notification" ADD COLUMN createdAt timestamptz DEFAULT now();` |

### Enum Expansion

Frontend `NotificationType` has 7 values. DB `EVENT` enum has 3. 4 are missing:

| Frontend Value | DB `EVENT` | Status |
|---|---|---|
| `SUGGESTION` | — | Missing |
| `INVITATION_GAME` | — | Missing |
| `INVITATION_TEAM` | — | Missing |
| `MENTION` | — | Missing |
| `FOLLOW_REQUEST` | `FOLLOW` | Name mismatch |
| `LIKE` | `LIKE_POST` | Name mismatch |
| `COMMENT` | `COMMENTED_POST` | Name mismatch |

**Action:**
```sql
ALTER TYPE event ADD VALUE 'SUGGESTION';
ALTER TYPE event ADD VALUE 'INVITATION_GAME';
ALTER TYPE event ADD VALUE 'INVITATION_TEAM';
ALTER TYPE event ADD VALUE 'MENTION';
```

Or align frontend enum names to match DB (recommended — less migration work):
- `FOLLOW_REQUEST` → `FOLLOW`
- `LIKE` → `LIKE_POST`
- `COMMENT` → `COMMENTED_POST`

---

## Game Table

| Field | Frontend | DB | Action |
|-------|---------|-----|--------|
| `ratingScore` | `string` ("4.9 / 5") | `game.score int` | Keep `score` as int in DB. Fix frontend type to `number`. Format in UI layer. |
| `rating_count` | `string` | No column | `ALTER TABLE "game" ADD COLUMN rating_count int DEFAULT 0;` — or compute from review posts |

---

## DB Tables with Zero Frontend Coverage

These tables exist in the schema but have NO TypeScript type representation. Not blocking MVP but should be added when building the corresponding features.

| Table | Columns | Missing Feature |
|-------|---------|----------------|
| `game_staff` | `id`, `userId`, `gameId`, `staff_title` | Staff/team management on game profiles |
| `reports` | `id`, `reporter_id`, `target_id`, `target_type`, `reason`, `description`, `status`, `resolved_by`, `resolved_at`, `createdAt` | Moderation system |
| `follows` | `id`, `follower_id`, `followed_id`, `followed_type` | Has frontend `UserStats.followers/following` (aggregated), but no typed model |
| `likes` | `id`, `userId`, `post_id` | Has frontend `likes_counter` on Post, but no typed model |
| `favorites` | `id`, `userId`, `item_id`, `item_type` | Has frontend `FavoriteGame[]` on User, but no typed model |

---

## DB Enums with Zero Frontend Coverage

| Enum | Values | Needed For |
|------|--------|-----------|
| `FOLLOWEE_TYPE` | `USER`, `GAME` | Follow system |
| `FAVORITE` | `POST`, `GAME` | Favorites system |
| `REPORT_STATUS` | `PENDING`, `RESOLVED`, `DISMISSED` | Moderation |
| `REPORT_TARGET` | `POST`, `REVIEW`, `COMMENT`, `USER`, `GAME` | Moderation |
| `REPORT_REASON` | `NSFW`, `HATE`, `SPAM`, `OTHER` | Moderation |

---

## Duplicate Frontend Types (Unify Candidate)

These represent the same concept but live in different files with incompatible shapes. Should be merged to one canonical type per domain.

| Concept | File 1 | File 2 | Impact |
|---------|--------|--------|--------|
| `Post` | `src/types/post.types.ts` (13 fields, DB-aligned) | `src/types/user.types.ts` (9 fields, card-display) | `user.types.ts` Post used in `User.posts[]`. Field names differ: `title`/`postTitle`, `likes`/`likes_counter`, `comments`/`commets_counter`, `commentsList`/`comments`. |
| `Comment` | `src/types/post.types.ts` (author_id, content, createdAt) | `src/types/user.types.ts` (userName, userAvatar, text, date) | Completely different field names for identical semantics. `user.types.ts` Comment used only in `User.Post.commentsList`. |
| `User` | `src/types/user.types.ts` (22 fields, full) | `src/features/chat/types/chat.types.ts` (12 fields, subset) | Chat version has different nullability. `username` and `email` are `string \| null` in chat, `string` (required) in user.types. |
