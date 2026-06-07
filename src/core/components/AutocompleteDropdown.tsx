/** Autocomplete dropdown component. */
import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Colors, Spacing, Radii, Typography } from "@/src/core/theme";

/** Single item in the autocomplete list. */
interface AutocompleteItem {
  id: string;
  label: string;
  subtitle?: string;
  avatar?: React.ReactNode;
}

interface AutocompleteDropdownProps {
  visible: boolean;
  items: AutocompleteItem[];
  query?: string;
  onSelect: (item: AutocompleteItem) => void;
  position: { top: number; left: number };
  renderItem?: (item: AutocompleteItem) => React.ReactNode;
  emptyText?: string;
  maxHeight?: number;
}

function defaultRenderItem(item: AutocompleteItem) {
  return (
    <View style={styles.row}>
      {item.avatar && <View style={styles.avatarWrap}>{item.avatar}</View>}
      <View style={styles.textWrap}>
        <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
        {item.subtitle && <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>}
      </View>
    </View>
  );
}

/** Dropdown with filterable list for autocomplete inputs. */
export default function AutocompleteDropdown({
  visible,
  items,
  query,
  onSelect,
  position,
  renderItem,
  emptyText = "Sin resultados",
  maxHeight = 200,
}: AutocompleteDropdownProps) {
  if (!visible) return null;

  const filtered = query
    ? items.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  if (filtered.length === 0) return null;

  return (
    <View style={[styles.container, { top: position.top, left: position.left, maxHeight }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.option} onPress={() => onSelect(item)}>
            {(renderItem ?? defaultRenderItem)(item)}
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 999,
    backgroundColor: "#fff",
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 200,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  avatarWrap: { width: 28, height: 28, borderRadius: 14, overflow: "hidden" },
  textWrap: { flex: 1 },
  label: { fontSize: Typography.sizes.md, fontWeight: "600", color: Colors.text.primary },
  subtitle: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginTop: 2 },
  empty: { padding: Spacing.md, textAlign: "center", color: Colors.text.secondary },
});
