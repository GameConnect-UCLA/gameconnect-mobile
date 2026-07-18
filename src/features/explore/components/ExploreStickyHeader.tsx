/** Explore sticky header */
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { FILTERS, type FilterKey } from '../utils/explore.utils'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'

type Props = {
  searchQuery: string
  activeFilter: FilterKey
  onChangeSearch: (value: string) => void
  onChangeFilter: (value: FilterKey) => void
  onBackPress: () => void
}

/** Sticky header with search bar and filter chips @param searchQuery Current search @param activeFilter Active filter @param onChangeSearch Search handler @param onChangeFilter Filter handler @param onBackPress Back handler @returns ExploreStickyHeader component */
export default function ExploreStickyHeader({
  searchQuery,
  activeFilter,
  onChangeSearch,
  onChangeFilter,
  onBackPress,
}: Props) {
  return (
    <ImageBackground
      source={require('@/assets/images/bgheader.png')}
      style={[styles.stickyHeader, { paddingTop: Spacing.sm }]}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color={Colors.text.primary} />
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
          const active = activeFilter === filter.key
          return (
            <TouchableOpacity
              key={filter.key}
              onPress={() => onChangeFilter(filter.key)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color="#FFFFFF"
                style={styles.filterIcon}
              />
              <Text style={styles.filterLabel}>{filter.label}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  stickyHeader: {
    width: '100%',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 17, 17, 0.18)',
  },
  backgroundImage: { resizeMode: 'cover' },
  contentContainer: { paddingHorizontal: Spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  backButton: {
    width: 36, height: 36, borderRadius: Radii.lg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  title: { fontSize: 20, lineHeight: 34, fontWeight: '700', color: Colors.text.primary, flex: 1, marginLeft: 2 },
  headerSpacer: { width: 36 },
  searchBar: {
    marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 42, paddingHorizontal: 14, borderRadius: Radii.lg,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: 'rgba(17, 17, 17, 0.08)',
  },
  searchInput: { flex: 1, fontSize: Typography.sizes.md, color: Colors.text.primary },
  filterRail: { paddingTop: 14, paddingBottom: 2, paddingHorizontal: Spacing.lg },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg,
    height: 42, borderRadius: 21, backgroundColor: Colors.primaryDark, marginRight: 10,
  },
  filterChipActive: { backgroundColor: Colors.primaryDark, transform: [{ scale: 1.03 }] },
  filterIcon: { marginRight: 7 },
  filterLabel: { color: '#FFFFFF', fontSize: Typography.sizes.sm, fontWeight: '700', letterSpacing: 0.3 },
})
