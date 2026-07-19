/** Post card/item component with author, media gallery, hashtags, and action buttons. */

import { usePostStore } from '../store/post.store'
import { useToastStore } from '@/src/core/store/toast.store'
import { useLikePost } from '@/src/features/post/hooks/useLikePost'
import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import type { Post } from '@/src/core/types/post.types'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'

/** Props for rendering a post in list (item) variant. */
export interface PostItemProps {
  id: string
  userId?: string
  userName: string
  userTag: string
  userAvatar: string
  title: string
  content: string
  imageUrl: string
  likes: number
  comments: number
}

interface Props {
  post?: Post
  separatorColor?: string
  onImagePress?: (url: string) => void
  initialImageIndex?: number
  variant?: 'card' | 'item'
  hideComment?: boolean
  onHashtagPress?: (tag: string) => void
  id?: string
  userId?: string
  userName?: string
  userTag?: string
  userAvatar?: string
  title?: string
  content?: string
  imageUrl?: string
  likes?: number
  comments?: number
}

function formatDate(timestamp: string) {
  try {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return timestamp
  }
}

/** Item variant scoped sub-component. */
interface ItemVariantProps {
  post?: Post
  hideComment?: boolean
  id?: string
  userId?: string
  userName?: string
  userTag?: string
  userAvatar?: string
  title?: string
  content?: string
  imageUrl?: string
  likes?: number
  comments?: number
  push: (route: any) => void
}

const ItemVariant: React.FC<ItemVariantProps> = ({
  post,
  hideComment = false,
  id: itemId,
  userId: itemUserId,
  userName: itemUserName,
  userTag: itemUserTag,
  userAvatar: itemUserAvatar,
  title: itemTitle,
  content: itemContent,
  imageUrl: itemImageUrl,
  likes: itemLikes = 0,
  comments: itemComments = 0,
  push,
}) => {
  const favoriteIds = usePostStore((s) => s.favoriteIds)
  const toggleFavorite = usePostStore((s) => s.toggleFavorite)
  const { mutate: likePostMutate } = useLikePost()
  const [isItemLiked, setIsItemLiked] = useState(false)
  const [itemLikesCount, setItemLikesCount] = useState(itemLikes)

  const resolvedId = itemId || post?.id || ''
  const isItemSaved = favoriteIds.includes(resolvedId)
  const displayItemLikes = isItemLiked ? itemLikesCount + 1 : itemLikesCount

  const handleItemLike = () => {
    setIsItemLiked((prev) => {
      setItemLikesCount((c) => (prev ? c - 1 : c + 1))
      return !prev
    })
    if (post?.id) likePostMutate(post.id)
  }

  const handleItemShare = async () => {
    await Share.share({ message: `Mira este post sobre ${itemTitle || post?.title || ''}` })
  }

  const goToDetail = () => {
    if (hideComment) return
    push(`/post/${resolvedId}` as any)
  }

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemHeader}
        onPress={() => push(`/user/${itemUserId || post?.author}` as any)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: itemUserAvatar || post?.authorUser.profilePic || '' }} style={styles.itemAvatar} />
        <View>
          <Text style={styles.itemUserName}>{itemUserName || post?.authorUser.username || ''}</Text>
          <Text style={styles.itemUserTag}>{itemUserTag || `@${post?.authorUser.username || ''}`}</Text>
        </View>
      </TouchableOpacity>

      <View>
        <Text style={styles.itemPostTitle}>{itemTitle || post?.title || ''}</Text>
        <Text style={styles.itemPostContent}>{itemContent || post?.content || ''}</Text>
      </View>

      {(itemImageUrl || post?.media?.urls?.[0]) ? (
        <Image source={{ uri: itemImageUrl || post?.media?.urls?.[0] || '' }} style={styles.itemPostImage} />
      ) : null}

      <View style={styles.itemFooterRow}>
        <View style={styles.itemLeftActions}>
          <TouchableOpacity style={styles.itemActionBtn} onPress={handleItemLike}>
            <Ionicons name={isItemLiked ? 'heart' : 'heart-outline'} size={26} color={isItemLiked ? '#D11D3B' : 'black'} />
            <Text style={styles.itemActionText}>{displayItemLikes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemActionBtn} onPress={goToDetail}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.itemActionText}>{itemComments || post?.commentsCounter || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleItemShare}>
            <Ionicons name="share-social-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(resolvedId)}>
          <Ionicons
            name={isItemSaved ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color={isItemSaved ? '#E8C339' : 'black'}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

/** Renders a post as a card (with media gallery) or list item. */
export default function PostCard({
  post, separatorColor = 'transparent', onImagePress, initialImageIndex = 0,
  variant = 'card', hideComment = false, onHashtagPress,
  id: itemId, userId: itemUserId, userName: itemUserName, userTag: itemUserTag,
  userAvatar: itemUserAvatar, title: itemTitle, content: itemContent,
  imageUrl: itemImageUrl, likes: itemLikes = 0, comments: itemComments = 0,
}: Props) {
  const toggleFavorite = usePostStore((state) => state.toggleFavorite)
  const favoriteIds = usePostStore((state) => state.favoriteIds)
  const showToast = useToastStore((state) => state.showToast)
  const { mutate: likePostMutate, isPending: isLikePending } = useLikePost()

  const { push } = useNavigation()
  const [isLiked, setIsLiked] = useState(post?.isLiked ?? false)
  const [cardWidth, setCardWidth] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const galleryRef = useRef<ScrollView>(null)

  const isSaved = favoriteIds.includes(post?.id ?? itemId ?? '')
  const displayedTitle = post?.title
  const contentPreview = post?.content?.slice(0, 160) ?? ''
  const displayLikes = post?.likesCounter ?? 0

  const imageCount = post?.media?.urls?.length ?? 1
  const mediaWidth = cardWidth > 0 ? cardWidth : undefined
  const hasMultipleImages = imageCount > 1

  const clampImageIndex = useCallback(
    (index: number) => Math.max(0, Math.min(index, imageCount - 1)),
    [imageCount]
  )

  const scrollToImageIndex = useCallback(
    (index: number, animated: boolean) => {
      if (!hasMultipleImages || !mediaWidth) return
      const boundedIndex = clampImageIndex(index)
      if (galleryRef.current) {
        galleryRef.current.scrollTo({ x: boundedIndex * mediaWidth, animated })
      }
    },
    [hasMultipleImages, mediaWidth, clampImageIndex]
  )

  useEffect(() => {
    if (!hasMultipleImages || !mediaWidth) return
    const boundedIndex = clampImageIndex(initialImageIndex)
    setActiveImageIndex(boundedIndex)
    requestAnimationFrame(() => scrollToImageIndex(boundedIndex, false))
  }, [hasMultipleImages, initialImageIndex, mediaWidth, clampImageIndex, scrollToImageIndex])

  const handleSharePress = () => {
    showToast('La opción se creará próximamente', 'success')
  }

  if (variant === 'item') {
    return (
      <ItemVariant
        post={post}
        hideComment={hideComment}
        id={itemId}
        userId={itemUserId}
        userName={itemUserName}
        userTag={itemUserTag}
        userAvatar={itemUserAvatar}
        title={itemTitle}
        content={itemContent}
        imageUrl={itemImageUrl}
        likes={itemLikes}
        comments={itemComments}
        push={push}
      />
    )
  }

  if (!post) return null

  const handleGoToDetail = (imageIndex = activeImageIndex) => {
    const boundedIndex = clampImageIndex(imageIndex)
    push(`/post/${post.id}?imageIndex=${boundedIndex}` as any)
  }

  const handleImagePress = (imageUrl: string, imageIndex: number) => {
    if (onImagePress) { onImagePress(imageUrl); return }
    handleGoToDetail(imageIndex)
  }

  const handleScrollToImage = (index: number) => {
    if (!hasMultipleImages || !mediaWidth || index < 0 || index >= (post.media?.urls?.length ?? 0)) return
    const boundedIndex = clampImageIndex(index)
    setActiveImageIndex(boundedIndex)
    scrollToImageIndex(boundedIndex, true)
  }

  return (
    <View style={styles.card} onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}>
      <View style={styles.authorRow}>
        <TouchableOpacity style={styles.authorClickArea} onPress={() => push(`/user/${post.author}` as any)} activeOpacity={0.7}>
          <Image source={{ uri: post.authorUser.profilePic }} style={styles.avatar} />
          <View style={styles.authorTextContainer}>
            <View style={styles.authorMetaRow}>
              <Text style={styles.authorName}>{post.authorUser.displayName || post.authorUser.username}</Text>
              <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
            </View>
            <Text style={styles.handle}>{`@${post.authorUser.username}`}</Text>
            {post.isReview && (
              <View style={styles.reviewMetaRow}>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Ionicons key={index} name={index < (post.reviewScore ?? 0) ? 'star' : 'star-outline'} size={16} color="#C48200" style={styles.starIcon} />
                  ))}
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={hideComment ? undefined : () => handleGoToDetail()} style={styles.contentTouchArea}>
        <Text style={[styles.title, post.isReview && styles.reviewTitle]}>{displayedTitle || ''}</Text>
        <Text style={styles.content}>{contentPreview}{post.content.length > 160 ? '...' : ''}</Text>
      </TouchableOpacity>

      {(post.media?.urls?.length ?? 0) > 0 ? (
        <View style={styles.galleryWrapper}>
          {hasMultipleImages ? (
            <>
              <ScrollView ref={galleryRef} horizontal pagingEnabled nestedScrollEnabled decelerationRate="fast" showsHorizontalScrollIndicator={false} style={styles.gallery}
                onMomentumScrollEnd={(event) => {
                  if (!mediaWidth) return
                  const nextIndex = clampImageIndex(Math.round(event.nativeEvent.contentOffset.x / mediaWidth))
                  setActiveImageIndex(nextIndex)
                }}>
                {post.media?.urls?.map((image, index) => (
                  <TouchableOpacity key={index} style={mediaWidth ? { width: mediaWidth } : undefined} activeOpacity={0.9} onPress={() => handleImagePress(image, index)}>
                    <View style={[styles.mediaFrame, styles.pagedMediaFrame, { width: mediaWidth }]}>
                      <Image source={{ uri: image }} style={styles.mediaImage} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => handleScrollToImage(activeImageIndex - 1)} disabled={activeImageIndex === 0} style={[styles.arrowButton, styles.leftArrow, activeImageIndex === 0 && styles.arrowDisabled]}>
                <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleScrollToImage(activeImageIndex + 1)} disabled={activeImageIndex >= (post.media?.urls?.length ?? 1) - 1} style={[styles.arrowButton, styles.rightArrow, activeImageIndex >= (post.media?.urls?.length ?? 1) - 1 && styles.arrowDisabled]}>
                <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity activeOpacity={0.9} onPress={() => handleImagePress(post.media?.urls?.[0] ?? '', 0)}>
              <View style={[styles.mediaFrame, styles.singleMediaFrame, { width: mediaWidth }]}>
                <Image source={{ uri: `${post.media?.urls?.[0]}?t=${new Date().getTime()}`}} style={styles.mediaImage} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {(post.hashtags?.length ?? 0) > 0 && (
        <View style={styles.hashtagRow}>
          {post.hashtags?.map((tag) => (
            <TouchableOpacity key={tag} style={styles.hashtagPill} onPress={() => onHashtagPress ? onHashtagPress(tag) : push(`/explore?q=%23${tag}`)}>
              <Text style={styles.hashtagText}>{`#${tag}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <View style={styles.counterBlock}>
            <TouchableOpacity onPress={() => { setIsLiked((c) => !c); likePostMutate(post.id) }} disabled={isLikePending}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={28} color={isLiked ? '#D11D3B' : '#111111'} />
            </TouchableOpacity>
            <Text style={styles.counterText}>{displayLikes}</Text>
          </View>
          <TouchableOpacity style={styles.counterBlock} onPress={hideComment ? undefined : () => handleGoToDetail()}>
            <Ionicons name="chatbubble-outline" size={26} color={Colors.text.primary} />
            <Text style={styles.counterText}>{post.commentsCounter}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSharePress}>
            <Ionicons name="share-social-outline" size={26} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(post.id)}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={28} color={isSaved ? '#E8C339' : '#111111'} />
        </TouchableOpacity>
      </View>
      <View style={[styles.separator, { backgroundColor: separatorColor }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: { marginHorizontal: Spacing.lg, paddingTop: 0, paddingBottom: 25, backgroundColor: 'transparent' },
  authorRow: { flexDirection: 'row', alignItems: 'flex-start' },
  authorClickArea: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, flex: 1 },
  avatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  authorTextContainer: { flex: 1, paddingTop: 10 },
  authorMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  authorName: { fontSize: 17, fontWeight: '700', color: '#151515', lineHeight: 20 },
  handle: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginTop: 5 },
  reviewMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  starIcon: { marginRight: 1 },
  date: { fontSize: 12, color: '#6B6B6B', fontWeight: '600', lineHeight: 20 },
  contentTouchArea: { marginTop: 2 },
  title: { marginTop: 10, fontSize: Typography.sizes.xl, fontWeight: '800', color: '#0F0F0F', lineHeight: 24 },
  reviewTitle: { textTransform: 'uppercase', fontSize: 20 },
  content: { marginTop: 5, fontSize: Typography.sizes.md, lineHeight: 20, color: '#2A2A2A' },
  gallery: { marginTop: Spacing.md },
  galleryWrapper: { marginTop: 10, position: 'relative' },
  mediaFrame: { height: 190, borderRadius: Radii.md, overflow: 'hidden', marginRight: 10 },
  pagedMediaFrame: { marginRight: 0 },
  singleMediaFrame: { marginTop: Spacing.md },
  mediaImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  arrowButton: { position: 'absolute', top: '50%', marginTop: -18, width: 36, height: 36, borderRadius: Radii.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(11,75,130,0.75)', zIndex: 4 },
  leftArrow: { left: 12 },
  rightArrow: { right: 12 },
  arrowDisabled: { opacity: 0.35 },
  hashtagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md },
  hashtagPill: { backgroundColor: 'rgba(248, 248, 248, 0.74)', borderRadius: 999, paddingHorizontal: Spacing.md, paddingVertical: 6 },
  hashtagText: { fontSize: Typography.sizes.sm, color: Colors.text.accent, fontWeight: '600' },
  actionsRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionsLeft: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  counterBlock: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  counterText: { fontSize: Typography.sizes.sm, color: Colors.text.primary, fontWeight: '600' },
  separator: { height: 1, marginTop: 18, marginBottom: -5 },
  itemContainer: { width: '100%', marginTop: 25 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  itemAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 10 },
  itemUserName: { fontFamily: 'Inter', fontWeight: '700', fontSize: Typography.sizes.lg },
  itemUserTag: { fontFamily: 'Inter', fontSize: Typography.sizes.sm, color: '#666' },
  itemPostTitle: { fontFamily: 'Inter', fontWeight: '800', fontSize: 17, marginTop: 5 },
  itemPostContent: { fontFamily: 'Inter', fontSize: Typography.sizes.md, color: '#000', marginVertical: 6, textAlign: 'justify' },
  itemPostImage: { width: '100%', height: 210, borderRadius: 10 },
  itemFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, paddingHorizontal: 5 },
  itemLeftActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  itemActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  itemActionText: { fontFamily: 'Inter', fontSize: 15, fontWeight: '500' },
})

/** Renders a post in list (item) variant via PostCard. */
export const PostItem: React.FC<PostItemProps> = (props) => (
  <PostCard variant="item" {...props} />
)
