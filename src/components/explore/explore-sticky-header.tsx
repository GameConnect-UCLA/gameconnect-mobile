import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { FILTERS, type FilterKey } from './explore.utils';

type Props = {
  searchQuery: string;
  activeFilter: FilterKey;
  onChangeSearch: (value: string) => void;
  onChangeFilter: (value: FilterKey) => void;
  onBackPress: () => void;
};

export default function ExploreStickyHeader({
  searchQuery,
  activeFilter,
  onChangeSearch,
  onChangeFilter,
  onBackPress,
}: Props) {
  return (
    <ImageBackground
      source={require('../../../assets/images/bgbody.png')}
      style={[
        styles.stickyHeader,
        { paddingTop: 8 }
      ]}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.title}>Explorar</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#4B4B4B" />
          <TextInput
            value={searchQuery}
            onChangeText={onChangeSearch}
            placeholder="Juegos, amigos, tendencias..."
            placeholderTextColor="#707070"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRail}
      >
        {FILTERS.map((filter) => {
          const active = activeFilter === filter.key;

          return (
            <TouchableOpacity
              key={filter.key}
              onPress={() => onChangeFilter(filter.key)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Ionicons name={filter.icon} size={16} color="#FFFFFF" style={styles.filterIcon} />
              <Text style={styles.filterLabel}>{filter.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    width: '100%', // Asegura que tome todo el ancho
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 17, 17, 0.18)',
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  contentContainer: {
    paddingHorizontal: 16, // Movemos el padding aquí para no afectar la imagen
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2ECE2',
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
    marginLeft: 2,
  },
  headerSpacer: {
    width: 36,
  },
  searchBar: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F2ECE2',
    borderWidth: 1,
    borderColor: 'rgba(17, 17, 17, 0.08)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  filterRail: {
    paddingTop: 14,
    paddingBottom: 2,
    paddingHorizontal: 16, // Añadido para que el primer chip no esté pegado al borde izquierdo
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0B4B82',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#0B4B82',
    transform: [{ scale: 1.03 }],
  },
  filterIcon: {
    marginRight: 7,
  },
  filterLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});