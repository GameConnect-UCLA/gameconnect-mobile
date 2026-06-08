/** Favorites screen with tabbed filter by Todo/Juegos/Posts. */

import { usePostStore } from "@/src/features/feed/store/post.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "@/src/features/feed/components/PostCard";
import { Spacing, Typography } from "@/src/core/theme";
import { useNavigation } from "@/src/core/hooks/useNavigation";

const BG_IMAGE = require("@/assets/images/bgbody.png");

/** Renders saved favorites filtered by tab (All, Games, Posts). */
export const FavoritesScreen = () => {
  const { back } = useNavigation();
  const [activeTab, setActiveTab] = useState("Todo");
  const { posts, favoriteIds } = usePostStore();

  const allFavorites = posts.filter((post) => favoriteIds.includes(post.id));

  const filteredFavorites = allFavorites.filter((post) => {
    if (activeTab === "Juegos") return post.is_review === true;
    if (activeTab === "Posts") return post.is_review === false;
    return true;
  });

  return (
    <ImageBackground source={BG_IMAGE} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Favoritos</Text>
            <Text style={styles.subtitle}>Tus reseñas favoritas</Text>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {["Todo", "Juegos", "Posts"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.counterText}>
          {filteredFavorites.length}{" "}
          {filteredFavorites.length === 1
            ? "Publicación guardada"
            : "Publicaciones guardadas"}
        </Text>

        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard post={item} separatorColor="rgba(0,0,0,0.05)" />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={60} color="#999" />
              <Text style={styles.emptyText}>
                No tienes favoritos en esta categoría
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    fontFamily: "Inter",
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: "#444",
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: 20,
  },
  tabButton: {
    paddingHorizontal: 25,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  tabButtonActive: {
    backgroundColor: "#FFF",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tabText: {
    fontSize: Typography.sizes.md,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#000",
  },
  counterText: {
    paddingHorizontal: 25,
    fontSize: Typography.sizes.sm,
    color: "#333",
    fontWeight: "500",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 5,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 15,
    fontSize: Typography.sizes.lg,
    color: "#333",
    fontWeight: "500",
  },
});
