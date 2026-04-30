import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameProfile } from '../../types/game.types';

interface Props {
  game: GameProfile;
}

export default function GameProfileView({ game }: Props) {
  const [activeTab, setActiveTab] = useState('Reseñas');

  return (
    <ImageBackground source={require('../../../assets/images/bgbody.png')} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView style={{ flex: 1 }}>
          
          {/* Header con botón de atrás */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => console.log('Volver')}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Tarjeta Principal */}
          <View style={styles.mainCard}>
            <View style={styles.coverWrapper}>
              <Image source={{ uri: game.cover_url }} style={styles.coverImage} />
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

              <Text style={styles.developer}>Creado por: {game.developer}</Text>

              {/* Etiquetas */}
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsLabel}>ETIQUETAS</Text>
                <View style={styles.tagList}>
                  {game.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
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
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 15, paddingVertical: 10, zIndex: 10 },
  mainCard: { marginTop: 10, marginHorizontal: 15, borderRadius: 30, backgroundColor: 'transparent' },
  coverWrapper: { width: '100%', height: 180, borderRadius: 30, overflow: 'hidden', position: 'absolute', top: 0, zIndex: 1 },
  coverImage: { width: '100%', height: '100%' },
  infoContainer: { marginTop: 170, padding: 20, borderRadius: 30, backgroundColor: '#EAEAEA', zIndex: 2 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#083E6D', flex: 1, marginRight: 10 },
  ratingBadge: { backgroundColor: '#003A63', borderRadius: 15, padding: 8, alignItems: 'center', minWidth: 80 },
  ratingLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold' },
  ratingValue: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
  developer: { fontSize: 12, color: '#555', marginTop: 5 },
  tagsContainer: { marginTop: 15 },
  tagsLabel: { fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 8 },
  tagList: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#C7C7C7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 12, color: 'black' },
  description: { fontSize: 14, color: '#333', lineHeight: 20, marginTop: 10 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 15 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  tab: { flex: 1, paddingVertical: 12, backgroundColor: '#C7C7C7', borderRadius: 20, alignItems: 'center', marginHorizontal: 5 },
  activeTab: { backgroundColor: '#003A63' },
  tabText: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  activeTabText: { color: '#fff' },
});