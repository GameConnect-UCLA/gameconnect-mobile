/** Search bar with clear button. */
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Spacing, Radii } from '@/src/core/theme'

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

/** Search input with clear button and search icon. */
const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Buscar...",
}: Props) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={styles.searchIcon.width} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: Radii.md,
    gap: Spacing.sm,
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

/** Search input with clear button. */
export default SearchBar
