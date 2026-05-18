import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.stickyHeader}>
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRail}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.42)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  filterRail: {
    paddingTop: 14,
    paddingBottom: 2,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(11, 75, 130, 0.9)',
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
