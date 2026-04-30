import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameProfile } from '../../types/game.types';

interface Props {
  game: GameProfile;
}

export default function GameProfileView({ game }: Props) {
  const [activeTab, setActiveTab] = useState('Reseñas');
  const router = useRouter();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground source={require('../../../assets/images/bgbody.png')} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
          {/* Tarjeta Principal */}
          <View style={[styles.mainCard, { minHeight: height }]}>
            <View style={styles.coverWrapper}>
              <Image source={{ uri: game.cover_url }} style={styles.coverImage} />
              <View style={styles.headerOverlay}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="chevron-back" size={28} color="#fff" />
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
                    <Text style={styles.ratingText}>{game.rating_score}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.developer}>
                Creado por: <Text style={styles.developerHandle}>{game.developer}</Text>
              </Text>

              {/* Etiquetas */}
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

              {/* Tabs */}
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

              {/* Espacio reservado para contenido futuro (posts/reseñas) */}
              <View style={styles.emptyPostsArea} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
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
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginTop: 230,
    paddingTop: 18,
    paddingHorizontal: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(227, 227, 227, 0.92)',
    zIndex: 2,
    flex: 1,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: '700', color: '#083E6D', flex: 1, marginRight: 10 },
  ratingBadge: {
    backgroundColor: '#003A63',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 92,
  },
  ratingLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500' },
  ratingValue: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 5 },
  developer: { fontSize: 14, color: '#575757', marginTop: 4 },
  developerHandle: { color: '#0B5EA7', fontWeight: '600' },
  tagsContainer: { marginTop: 12 },
  tagsLabel: { fontSize: 16, fontWeight: '700', color: '#101010', marginBottom: 10 },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  tag: {
    borderWidth: 1,
    borderColor: '#335892',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(227, 227, 227, 0.75)',
  },
  tagText: { fontSize: 16, color: '#2A51A1', fontWeight: '400', lineHeight: 20 },
  addTagButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#335892',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  description: { fontSize: 16, color: '#262626', lineHeight: 22, marginTop: 8 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.16)', marginVertical: 18 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#2E5A92',
    backgroundColor: 'transparent',
  },
  activeTab: { backgroundColor: '#003A63' },
  tabText: { fontSize: 16, fontWeight: '700', color: '#003A63' },
  activeTabText: { color: '#fff' },
  emptyPostsArea: {
    flex: 1,
    backgroundColor: 'rgba(227, 227, 227, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
});