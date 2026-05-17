import { useMockUser } from '@/src/hooks/mock-data/useMockUser';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BG_IMAGE = require('@/assets/images/bgbody.png');

interface ProfileViewProps {
  onEditPress?: () => void;
  onAddPeoplePress?: () => void;
  onAddGamePress?: () => void;
  onViewAllGamesPress?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  onEditPress,
  onAddPeoplePress,
  onAddGamePress,
  onViewAllGamesPress,
}) => {
  const user = useMockUser();
  const displayName = user.display_name.toUpperCase();
  const bioLine = user.bio?.split('\n').filter(Boolean).join(' | ') || '';

  const renderBioWithIcon = () => {
    if (!bioLine) return null;
    const parts = bioLine.split(' | ');
    const firstPart = parts[0]; 
    const restParts = parts.slice(1).join(' | '); 
    return (
      <View style={styles.bioContainer}>
        <Text style={styles.userBio}>
          {firstPart}
          <Ionicons name="game-controller-outline" size={16} color="#000000" style={styles.bioIconInline} />
          {restParts ? ` | ${restParts}` : ''}
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header: Portada y Avatar */}
          <View style={styles.coverContainer}>
            <ImageBackground
              source={{ uri: user.cover_pic }}
              style={styles.coverImage}
              resizeMode="cover"
            >
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
              </View>
            </ImageBackground>
          </View>

          {/* TARJETA GRANDE (Diseño Flotante) */}
          <View style={styles.bigCard}>
            <View style={styles.profileCard}>
              
              {/* Fila de Nombre y Acciones */}
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{displayName}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={onEditPress} style={styles.editButtonInline}>
                    <Ionicons name="create-outline" size={20} color="#033563" />
                    <Text style={styles.actionTextInline}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onAddPeoplePress} style={styles.addButtonInline}>
                    <Ionicons name="person-add-outline" size={22} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.userUsername}>@{user.username}</Text>

              {renderBioWithIcon()}

              <View style={styles.joinDateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.joinDate}> Se unió en {user.created_at}</Text>
              </View>

              {/* Estadísticas */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.stats.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.stats.followers}</Text>
                  <Text style={styles.statLabel}>Seguidores</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.stats.following}</Text>
                  <Text style={styles.statLabel}>Siguiendo</Text>
                </View>
              </View>

              <View style={styles.separatorLine} />

              {/* SECCIÓN ACTUALIZADA: JUEGOS FAVORITOS CON IMÁGENES */}
              <View style={styles.favoritesSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.titleWithIcon}>
                    <Ionicons name="game-controller-outline" size={22} color="#000000" />
                    <Text style={styles.sectionTitle}>JUEGOS FAVORITOS</Text>
                  </View>
                  <TouchableOpacity onPress={onAddGamePress} style={styles.plusButton}>
                    <Ionicons name="add-circle" size={26} color="#033563" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.gamesScrollContent}
                >
                  {user.favorite_games.map((game) => (
                    <View key={game.id} style={styles.gameCard}>
                      <Image source={{ uri: game.image_url }} style={styles.gameImage} />
                      <Text style={styles.gameNameLabel} numberOfLines={1}>{game.name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.separatorLine} />

              {/* Post Destacado */}
              {user.featured_post && (
                <View style={styles.featuredSection}>
                  <View style={styles.featuredUser}>
                    <Text style={styles.featuredUserName}>{user.display_name}</Text>
                    <Text style={styles.featuredUserTag}>{user.featured_post.tag}</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{user.featured_post.title}</Text>
                  <Text style={styles.featuredDescription}>
                    {user.featured_post.description}
                  </Text>
                </View>
              )}
              
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    paddingBottom: 40, // Espacio al final para que no pegue al navbar
  },
  coverContainer: { marginTop: 0 },
  coverImage: {
    width: '100%',
    height: 240,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  
  // DISEÑO FLOTANTE CORREGIDO
  bigCard: {
    backgroundColor: 'rgba(204, 204, 204, 0.85)',
    borderRadius: 24,            // Bordes redondeados en las 4 esquinas
    marginHorizontal: 0,       // Separación lateral de los bordes
    marginTop: -70,
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 30,
    marginBottom: 20,           // Espacio con el Navbar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  profileCard: {
    backgroundColor: 'transparent',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#033563',
  },
  editButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextInline: {
    marginLeft: 4,
    fontSize: 14,
    color: '#033563',
    fontWeight: '500',
  },
  addButtonInline: {
    paddingLeft: 5,
  },
  userUsername: { 
    fontSize: 16, 
    color: '#000000', 
    marginTop: 4 
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userBio: {
    fontSize: 16,
    color: '#000000',
  },
  bioIconInline: {
    marginHorizontal: 4,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  joinDate: { fontSize: 14, color: '#666', marginLeft: 4 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#000000' },
  statLabel: { fontSize: 14, color: '#000000', marginTop: 2 },
  separatorLine: {
    height: 1,
    backgroundColor: '#000000',
    width: '100%',
    marginVertical: 15,
    opacity: 0.2
  },
  
  // ESTILOS DE JUEGOS FAVORITOS
  favoritesSection: { width: '100%' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  plusButton: {
    padding: 2,
  },
  gamesScrollContent: {
    paddingRight: 20,
  },
  gameCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  gameImage: {
    width: 120,
    height: 75,
    borderRadius: 6,
    backgroundColor: '#333',
    marginBottom: 6,
  },
  gameNameLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    width: '100%'
  },

  featuredSection: { marginTop: 5 },
  featuredUser: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featuredUserName: { fontSize: 18, fontWeight: 'bold', color: '#222', marginRight: 8 },
  featuredUserTag: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  featuredTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  featuredDescription: { fontSize: 14, color: '#444', lineHeight: 20 },
});

export default ProfileView;