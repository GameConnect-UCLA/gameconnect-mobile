import { useMockGameProfile } from '@/src/hooks/mock-data/useMockGameProfile';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 1. Importamos el router
import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const BG_IMAGE = require('@/assets/images/bgbody.png');

interface FavoriteGamesViewProps {
  onBack: () => void;
}

const FavoriteGamesView: React.FC<FavoriteGamesViewProps> = ({ onBack }) => {
  const games = useMockGameProfile();
  const router = useRouter();

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.bigCard}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.titleWithIcon}>
                <Ionicons name="game-controller" size={24} color="#033563" />
                <Text style={styles.sectionTitle}>JUEGOS FAVORITOS</Text>
              </View>
              <TouchableOpacity onPress={onBack}>
                <Ionicons name="remove-circle" size={28} color="#033563" />
              </TouchableOpacity>
            </View>

            {/* Grid de 2 columnas */}
            <View style={styles.gridContainer}>
              {games.map((game) => (
                <TouchableOpacity 
                  key={game.id} 
                  style={styles.gameItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    router.push(`/game/${game.id}`);
                  }}
                >
                  <Image source={{ uri: game.image_url }} style={styles.gameImage} />
                  <Text style={styles.gameTitle} numberOfLines={1}>{game.name}</Text>
                  <Text style={styles.gameDescription} numberOfLines={4}>
                    {game.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { 
    flex: 1 
  },
  container: { 
    flex: 1 
  },
  scrollContent: { 
    paddingVertical: 30, 
    paddingHorizontal: 15 
  },
  bigCard: {
    backgroundColor: 'rgba(217, 217, 217, 0.85)', 
    borderRadius: 30,
    padding: 16,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: { 
    fontFamily: 'Inter',
    fontWeight: '600', 
    fontSize: 18, 
    color: '#000000' 
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameItem: {
    width: '48%', 
    marginBottom: 25,
  },
  gameImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  gameTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  gameDescription: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 11,
    color: '#000000',
    marginTop: 6,
    textAlign: 'justify',
    lineHeight: 15,
  },
});

export default FavoriteGamesView;