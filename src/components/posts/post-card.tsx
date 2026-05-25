import { usePostStore } from '@/src/store/post.store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Post } from '../../types/post.types';

interface Props {
  post: Post;
  separatorColor?: string;
  onImagePress?: (url: string) => void;
  initialImageIndex?: number;
}

function formatDate(timestamp: string) {
  try {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (e) {
    return timestamp;
  }
}

export default function PostCard({ post, separatorColor = 'transparent', onImagePress, initialImageIndex = 0 }: Props) {
  const router = useRouter();
  const toggleFavorite = usePostStore((state) => state.toggleFavorite);
  const favoriteIds = usePostStore((state) => state.favoriteIds);

  const isSaved = favoriteIds.includes(post.id);

  const [isLiked, setIsLiked] = useState(false);
  
  const [cardWidth, setCardWidth] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryRef = useRef<ScrollView>(null);

  const displayedTitle = post.is_review ? post.reviewed_game : post.post_title;
  const contentPreview = post.content.slice(0, 160);
  const displayLikes = isLiked ? post.likes_counter + 1 : post.likes_counter;

  const mediaWidth = cardWidth > 0 ? cardWidth : undefined;
  const hasMultipleImages = post.media.images.length > 1;

  const clampImageIndex = (index: number) => Math.max(0, Math.min(index, post.media.images.length - 1));

  const scrollToImageIndex = (index: number, animated: boolean) => {
    if (!hasMultipleImages || !mediaWidth) {
      return;
    }

    const boundedIndex = clampImageIndex(index);
    galleryRef.current?.scrollTo({ x: boundedIndex * mediaWidth, animated });
  };

  useEffect(() => {
    if (!hasMultipleImages || !mediaWidth) {
      return;
    }

    const boundedIndex = clampImageIndex(initialImageIndex);
    setActiveImageIndex(boundedIndex);
    requestAnimationFrame(() => {
      scrollToImageIndex(boundedIndex, false);
    });
  }, [clampImageIndex, hasMultipleImages, initialImageIndex, mediaWidth, scrollToImageIndex]);

  const handleGoToDetail = (imageIndex = activeImageIndex) => {
    const boundedIndex = clampImageIndex(imageIndex);
    router.push(`/post/${post.id}?imageIndex=${boundedIndex}` as any);
  };

  const handleImagePress = (imageUrl: string, imageIndex: number) => {
    if (onImagePress) {
      onImagePress(imageUrl);
      return;
    }

    handleGoToDetail(imageIndex);
  };

  const handleScrollToImage = (index: number) => {
    if (!hasMultipleImages || !mediaWidth || index < 0 || index >= post.media.images.length) {
      return;
    }

    const boundedIndex = clampImageIndex(index);
    setActiveImageIndex(boundedIndex);
    scrollToImageIndex(boundedIndex, true);
  };

  return (
    <View
      style={styles.card}
      onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
    >
      {/* HEADER */}
      <View style={styles.authorRow}>
        <TouchableOpacity 
          style={styles.authorClickArea}
          onPress={() => router.push(`/user/${post.autor}` as any)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: post.author_profile_pic }} style={styles.avatar} />
          <View style={styles.authorTextContainer}>
            <View style={styles.authorMetaRow}>
              <Text style={styles.authorName}>{post.author_display_name}</Text>
              <Text style={styles.date}>{formatDate(post.created_at)}</Text>
            </View>
            <Text style={styles.handle}>{`@${post.author_username}`}</Text>
            {post.is_review && (
              <View style={styles.reviewMetaRow}>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Ionicons
                      key={index}
                      name={index < (post.review_score ?? 0) ? 'star' : 'star-outline'}
                      size={16}
                      color="#C48200"
                      style={styles.starIcon}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleGoToDetail()}
        style={styles.contentTouchArea}
      >
        <Text style={[styles.title, post.is_review && styles.reviewTitle]}>{displayedTitle}</Text>
        <Text style={styles.content}>{contentPreview}{post.content.length > 160 ? '...' : ''}</Text>
      </TouchableOpacity>

      {/* GALERÍA DE IMÁGENES */}
      {post.media.images.length > 0 ? (
        <View style={styles.galleryWrapper}>
          {hasMultipleImages ? (
            <>
              <ScrollView
                ref={galleryRef}
                horizontal
                pagingEnabled
                nestedScrollEnabled
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                style={styles.gallery}
                onMomentumScrollEnd={(event) => {
                  if (!mediaWidth) return;
                  const nextIndex = clampImageIndex(Math.round(event.nativeEvent.contentOffset.x / mediaWidth));
                  setActiveImageIndex(nextIndex);
                }}
              >
                {post.media.images.map((image, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={mediaWidth ? { width: mediaWidth } : undefined}
                    activeOpacity={0.9} 
                    onPress={() => handleImagePress(image, index)}
                  >
                    <View style={[styles.mediaFrame, styles.pagedMediaFrame, { width: mediaWidth }]}>
                      <Image source={{ uri: image }} style={styles.mediaImage} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => handleScrollToImage(activeImageIndex - 1)}
                disabled={activeImageIndex === 0}
                style={[styles.arrowButton, styles.leftArrow, activeImageIndex === 0 && styles.arrowDisabled]}
              >
                <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleScrollToImage(activeImageIndex + 1)}
                disabled={activeImageIndex === post.media.images.length - 1}
                style={[styles.arrowButton, styles.rightArrow, activeImageIndex === post.media.images.length - 1 && styles.arrowDisabled]}
              >
                <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => handleImagePress(post.media.images[0], 0)}
            >
              <View style={[styles.mediaFrame, styles.singleMediaFrame, { width: mediaWidth }]}>
                <Image source={{ uri: post.media.images[0] }} style={styles.mediaImage} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {/* HASHTAGS */}
      {post.media.hashtags.length > 0 && (
        <View style={styles.hashtagRow}>
          {post.media.hashtags.map((tag) => (
            <View key={tag} style={styles.hashtagPill}>
              <Text style={styles.hashtagText}>{`#${tag}`}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ACCIONES */}
      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <View style={styles.counterBlock}>
            <TouchableOpacity onPress={() => setIsLiked((current) => !current)}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? '#D11D3B' : '#111111'}
              />
            </TouchableOpacity>
            <Text style={styles.counterText}>{displayLikes}</Text>
          </View>

          <TouchableOpacity style={styles.counterBlock} onPress={() => handleGoToDetail()}>
            <Ionicons name="chatbubble-outline" size={26} color="#111111" />
            <Text style={styles.counterText}>{post.commets_counter}</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={26} color="#111111" />
          </TouchableOpacity>
        </View>

        {/* BOTÓN DE FAVORITO */}
        <TouchableOpacity onPress={() => toggleFavorite(post.id)}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={isSaved ? '#E8C339' : '#111111'}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.separator, { backgroundColor: separatorColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 25,
    backgroundColor: 'transparent',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  authorClickArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  authorTextContainer: {
    flex: 1,
    paddingTop: 10,
  },
  authorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  authorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#151515',
    lineHeight: 20,
  },
  handle: {
    fontSize: 13,
    color: '#535353',
    marginTop: 5,
  },
  reviewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 1,
  },
  date: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
    lineHeight: 20,
  },
  contentTouchArea: {
    marginTop: 2,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F0F0F',
    lineHeight: 24,
  },
  reviewTitle: {
    textTransform: 'uppercase',
    fontSize: 20,
  },
  content: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: '#2A2A2A',
  },
  gallery: {
    marginTop: 12,
  },
  galleryWrapper: {
    marginTop: 10,
    position: 'relative',
  },
  mediaFrame: {
    height: 190,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 10,
  },
  pagedMediaFrame: {
    marginRight: 0,
  },
  singleMediaFrame: {
    marginTop: 12,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,75,130,0.75)',
    zIndex: 4,
  },
  leftArrow: {
    left: 12,
  },
  rightArrow: {
    right: 12,
  },
  arrowDisabled: {
    opacity: 0.35,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  hashtagPill: {
    backgroundColor: 'rgba(248, 248, 248, 0.74)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hashtagText: {
    fontSize: 13,
    color: '#2A53A0',
    fontWeight: '600',
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  counterBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  counterText: {
    fontSize: 13,
    color: '#111111',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginTop: 18,
    marginBottom: -5,
  },
});