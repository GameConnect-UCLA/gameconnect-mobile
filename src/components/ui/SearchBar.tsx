import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const SearchBar = () => {
  return (
          <View style={styles.searchContainer}>
        <Ionicons name="search" size={styles.searchIcon.width} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversaciones..."
          placeholderTextColor="#999"
        />
      </View>
  )
}

const styles = StyleSheet.create({

      searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 14,
    gap: 8,
  },
  searchIcon: {
    width: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    paddingVertical: 0,
  },

})

export default SearchBar