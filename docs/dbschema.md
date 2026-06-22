// ENUMS
enum USER_STATE {
  ACTIVE
  TO_DELETE
}

enum FAVORITE {
  POST
  GAME
}

enum GROUP_ROLE {
  OWNER
  ADMIN
  MEMBER
}

enum USER_ROLE {
  MODERATOR
  USER
}

enum FOLLOWEE_TYPE {
  USER
  GAME
}

enum MESSAGE_TYPE {
  GROUP_MESSAGE
  DIRECT_MESSAGE
}

enum EVENT {
  LIKE
  FOLLOW
  COMMENT
  MENTION
  MESSAGE
}

enum REPORT_STATUS {
  PENDING
  RESOLVED
  DISMISSED
}

enum REPORT_TARGET {
  POST
  REVIEW
  COMMENT
  USER
  GAME
}

enum REPORT_REASON {
  NSFW
  HATE
  SPAM
  OTHER
}

// enum MODERATION_FLAG {
//   HIDDEN
//   REMOVED
//   NSFW
//   UNDER_REVIEW
// }


Table user {
  id uuid [pk, not null]
  username varchar(30)
  displayName varchar(30)
  pronouns varchar(30)
  role USER_ROLE
  email varchar(30) [unique]
  bio varchar(120)
  birthDate date
  accountSettings jsonb
  profilePic url
  coverPic url
  verified bool
  state USER_STATE
  bannedAt timestampz
  banReason text
  createdAt timestampz
  deletedAt timestampz
}

Table user_auth {
  id uuid [pk]
  userId uuid [not null, ref: > user.id]
  provider varchar(30) [not null]  // 'local', 'google', 'discord'
  provider_id varchar(255)// null para 'local', ID externo para OAuth
  password_hash varchar(255) // solo para 'local', null para OAuth
  createdAt timestampz [not null]
}

// Feed Feature needs: 

Table follows {
  id uuid [pk, not null]
  follower_id uuid [ref: > user.id]
  followed_id uuid
  followed_type FOLLOWEE_TYPE
}

Table post {
  id uuid [pk, not null]
  author uuid [ref: > user.id]
  original_post_id uuid [null, ref: > post.id]

  title text
  content text // preferible simple .md
  media jsonb // urls for img, gif, videos

  hashtags text[]
  is_review bool 
  is_repost bool
  reviewed_game uuid [null, ref: > game.id]
  review_score float
  likes_counter int
  commentsCounter int

  createdAt timestampz
  last_modified_at timestampz
  deletedAt timestampz
}


Table comment {
  id uuid [pk, not null]
  parent_id uuid [ref: > post.id] 
  comment_parent_id uuid [null, ref: > comment.id] // Only if it is a subcomment
  author uuid [ref: > user.id]
  content text // .md
  media jsonb

  createdAt timestampz
  last_modified_at timestampz
  deletedAt timestampz
}

Table game {
  id uuid [pk, not null]
  metadata jsonb // extracted from IGDB
  score int
  review_rating_count int
}

table game_staff {
  id uuid [pk]
  userId uuid [ref: > user.id]
  gameId uuid [ref: > game.id]
  staff_title varchar(30)
  
}

Table likes {
  id uuid [pk, not null]
  userId uuid [ref: > user.id] // user that likes the content
  post_id uuid [ref: > post.id] // post that is being liked
}

Table favorites {
  id uuid [pk, not null]
  userId uuid [ref: > user.id]
  item_id uuid
  item_type FAVORITE
}

// CHAT FEATURE
Table message {
  id uuid [pk, not null]
  sentBy uuid [ref: > user.id]
  conversation uuid [null, ref: > conversation.id]
  replyTo uuid [null, ref: > message.id]
  type MESSAGE_TYPE
  messageText text
  attachedMedia jsob //urls
  sentAt timestampz

}

Table conversation {
  id uuid [pk, not null]
  name varchar(30)
  groupPicture text // url
  createdBy uuid [ref: > user.id]
  createdAt timestampz
}

Table group_member {
  id uuid [pk, not null]
  userId uuid [ref: < user.id]
  conversation uuid [ref: < conversation.id]
  role GROUP_ROLE
  joinedAt timestampz
  leftAt timestampz
}

// IN-APP NOTIFICATIONS FEATURE
Table notification {
  id uuid [pk]
  userId uuid [ref: > user.id]
  type EVENT
  payload jsonb
  read bool
  createdAt timestampz

}

// expo notification tokens DECOMMENT FOR IMPL
// Table user_push_notification_token {
//   id uuid [pk]
//   userId uuid [not null, ref: > user.id]
//   token varchar(255) [not null, unique]
//   createdAt timestampz
//   last_seen timestampz 
// }

// MODERATION
Table reports {
  id uuid [pk]
  reporter_id uuid [not null, ref: > user.id]
  target_id uuid [not null]
  target_type REPORT_TARGET [not null] // 'post' | 'comment' | 'user' | 'review' | 'game'
  reason REPORT_REASON // 'spam' | 'hate_speech' | 'nsfw' | 'other'
  description text
  status varchar(20) [not null, default: REPORT_STATUS.PENDING] // 'pending' | 'resolved' | 'dismissed'
  resolved_by uuid [ref: > user.id]
  resolved_at timestampz
  createdAt timestampz 
}

// Table content_flag {
//   id uuid [pk]
//   target_id uuid [not null, unique]
//   target_type REPORT_TARGET [not null, unique]
//   flag_type MODERATION_FLAG [not null] // 'hidden' | 'removed' | 'nsfw' | 'under_review'
//   flagged_by uuid [ref: > user.id] // el mod que lo aplicó
//   reason text
//   createdAt timestampz [not null]
// }
