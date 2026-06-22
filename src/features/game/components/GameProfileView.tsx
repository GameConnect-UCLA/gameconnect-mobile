/** Game profile view component */
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { mockPosts } from '@/src/mocks/mock-posts'
import type { GameProfile } from '../types/game.types'
import PostCard from '@/src/features/feed/components/PostCard'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'
import { useNavigation } from '@/src/core/hooks/useNavigation'

interface Props {
  game: GameProfile
}

/** Game profile screen with cover, info, tabs, and related posts @param game GameProfile data @returns GameProfileView component */
export default function GameProfileView({ game }: Props) {
  const { push, back } = useNavigation()
  const [activeTab, setActiveTab] = useState('Reseñas')
  const { height } = useWindowDimensions()
  const relatedPosts = mockPosts.filter((post) => {
    const matchesGame = post.reviewed_game.toLowerCase() === game.title.toLowerCase()
    const matchesTab = activeTab === 'Reseñas' ? post.is_review : !post.is_review
    return matchesGame && matchesTab
  })

  return (
    <ImageBackground source={require('@/assets/images/bgbody.png')} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
          <View style={[styles.mainCard, { minHeight: height }]}>
            <View style={styles.coverWrapper}>
              <Image source={{ uri: game.coverUrl }} style={styles.coverImage} />
              <View style={styles.headerOverlay}>
                <TouchableOpacity onPress={() => back()} style={styles.backButton}>
                  <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => push(`/game/${game.id}/settings`)}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{game.title}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingLabel}>PUNTAJE</Text>
                  <View style={styles.ratingValue}>
                    <Ionicons name="star" size={16} color="#FFE600" />
                    <Text style={styles.ratingText}>{(game.score / 10).toFixed(1) + ' / 5'}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.developer}>
                Creado por: <Text style={styles.developerHandle}>{game.developer}</Text>
              </Text>

              <View style={styles.tagsContainer}>
                <Text style={styles.tagsLabel}>ETIQUETAS</Text>
                <View style={styles.tagList}>
                  {game.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addTagButton}>
                    <Ionicons name="add" size={16} color="#003A63" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.description}>{game.description}</Text>

              <View style={styles.divider} />

              <View style={styles.tabContainer}>
                {['Reseñas', 'Noticias'].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.postsArea}>
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} separatorColor="rgba(0, 0, 0, 0.12)" />
                  ))
                ) : (
                  <Text style={styles.emptyPostsText}>
                    No hay publicaciones relacionadas en esta sección.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  contentContainer: { flexGrow: 1, backgroundColor: 'transparent' },
  mainCard: {
    marginTop: 0,
    marginHorizontal: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  coverWrapper: {
    width: '100%',
    height: 260,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  coverImage: { width: '100%', height: '100%' },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingHorizontal: 10,
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 58, 99, 0.66)',
  },
  editButtonText: {
    color: '#fff',
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  infoContainer: {
    marginTop: 230,
    paddingTop: 18,
    paddingHorizontal: Spacing.lg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(227, 227, 227, 0.92)',
    zIndex: 2,
    flex: 1,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: '700', color: '#083E6D', flex: 1, marginRight: 10 },
  ratingBadge: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 92,
  },
  ratingLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500' },
  ratingValue: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { color: '#fff', fontSize: Typography.sizes.xl, fontWeight: '700', marginLeft: 5 },
  developer: { fontSize: Typography.sizes.md, color: '#575757', marginTop: Spacing.xs },
  developerHandle: { color: '#0B5EA7', fontWeight: '600' },
  tagsContainer: { marginTop: Spacing.md },
  tagsLabel: { fontSize: Typography.sizes.lg, fontWeight: '700', color: '#101010', marginBottom: 10 },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  tag: {
    borderWidth: 1,
    borderColor: '#335892',
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(227, 227, 227, 0.75)',
  },
  tagText: { fontSize: Typography.sizes.lg, color: '#2A51A1', fontWeight: '400', lineHeight: 20 },
  addTagButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#335892',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  description: { fontSize: Typography.sizes.lg, color: '#262626', lineHeight: 22, marginTop: Spacing.sm },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.16)', marginVertical: 18 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.xl,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#2E5A92',
    backgroundColor: 'transparent',
  },
  activeTab: { backgroundColor: Colors.primaryDark },
  tabText: { fontSize: Typography.sizes.lg, fontWeight: '700', color: Colors.primaryDark },
  activeTabText: { color: '#fff' },
  postsArea: {
    flex: 1,
    backgroundColor: 'rgba(227, 227, 227, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
    paddingTop: 10,
    paddingBottom: Spacing.lg,
  },
  emptyPostsText: {
    color: '#5C5C5C',
    fontSize: Typography.sizes.md,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: Spacing.xl,
  },
})
