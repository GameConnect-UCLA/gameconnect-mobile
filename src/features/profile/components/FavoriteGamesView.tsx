/** Favorite games screen */
import { useMockGameProfile } from "@/src/features/game/hooks/useGameProfiles";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, Radii, Typography } from "@/src/core/theme";
import SearchBar from "@/src/core/components/SearchBar";
import { normalizeText } from "@/src/core/utils/string";
import { useNavigation } from "@/src/core/hooks/useNavigation";

const BG_IMAGE = require("@/assets/images/bgbody.png");

interface FavoriteGamesViewProps {
  onBack: () => void;
}

/** Favorite games grid with search @param onBack Back callback @returns FavoriteGamesView component */
const FavoriteGamesView: React.FC<FavoriteGamesViewProps> = ({ onBack }) => {
  const allGames = useMockGameProfile();
  const { push } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const games = useMemo(() => {
    if (!searchQuery.trim()) return allGames;
    const q = normalizeText(searchQuery);
    return allGames.filter((g) => normalizeText(g.name).includes(q));
  }, [allGames, searchQuery]);

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.bigCard}>
            <View style={styles.headerRow}>
              <View style={styles.titleWithIcon}>
                <Ionicons
                  name="game-controller"
                  size={24}
                  color={Colors.primary}
                />
                <Text style={styles.sectionTitle}>JUEGOS FAVORITOS</Text>
              </View>
              <TouchableOpacity onPress={onBack}>
                <Ionicons
                  name="remove-circle"
                  size={28}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar juegos..."
            />

            <View style={styles.gridContainer}>
              {games.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gameItem}
                  activeOpacity={0.7}
                  onPress={() => push(`/game/${game.id}`)}
                >
                  <Image
                    source={{ uri: game.imageUrl }}
                    style={styles.gameImage}
                  />
                  <Text style={styles.gameTitle} numberOfLines={1}>
                    {game.name}
                  </Text>
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
  backgroundImage: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingVertical: 30, paddingHorizontal: 15 },
  bigCard: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: 30,
    padding: Spacing.lg,
    minHeight: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: Typography.sizes.xl,
    color: "#000000",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gameItem: { width: "48%", marginBottom: 25 },
  gameImage: {
    width: "100%",
    height: 100,
    borderRadius: Radii.sm,
    backgroundColor: "#333",
  },
  gameTitle: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: Typography.sizes.md,
    color: "#000000",
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  gameDescription: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: Typography.sizes.xs,
    color: "#000000",
    marginTop: 6,
    textAlign: "justify",
    lineHeight: 15,
  },
});

export default FavoriteGamesView;
