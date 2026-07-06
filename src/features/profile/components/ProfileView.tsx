/** Profile view component */
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "@/src/features/feed/components/PostCard";
import { fetchUserPosts } from "@/src/features/post/api/post.api";
import { Colors, Spacing, Radii, Typography } from "@/src/core/theme";
import { useNavigation } from "@/src/core/hooks/useNavigation";
import { User } from "../types/user.types";

const BG_IMAGE = require("@/assets/images/bgbody.png");

interface ProfileViewProps {
  user: User;
  isSelf?: boolean;
  onEditPress?: () => void;
  onAddPeoplePress?: () => void;
  onAddGamePress?: () => void;
  onViewAllGamesPress?: () => void;
  onBackPress?: () => void;
  onSettingsPress?: () => void;
  onFollowPress?: () => void;
}

/** User profile screen with cover, stats, favorites, and posts @param user User data @param isSelf Is current user @param onEditPress Edit callback @param onAddPeoplePress Add people callback @param onAddGamePress Add game callback @param onViewAllGamesPress View all games callback @param onBackPress Back callback @param onSettingsPress Settings callback @param onFollowPress Follow callback @returns ProfileView component */
const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isSelf = false,
  onEditPress,
  onAddPeoplePress,
  onAddGamePress,
  onBackPress,
  onSettingsPress,
  onFollowPress,
}) => {
  const { back } = useNavigation();

  const { data: userPosts = [] } = useQuery({
    queryKey: ['posts', 'user', user.id],
    queryFn: () => fetchUserPosts(user.id),
    enabled: !!user.id,
  });

  const displayName = user.displayName ? user.displayName : "";
  const bioLine = user.bio?.split("\n").filter(Boolean).join(" | ") || "";

  const renderBioWithIcon = () => {
    if (!bioLine) return null;
    const parts = bioLine.split(" | ");
    const firstPart = parts[0];
    const restParts = parts.slice(1).join(" | ");
    return (
      <View style={styles.bioContainer}>
        <Text style={styles.userBio}>
          {firstPart}
          <Ionicons
            name="game-controller-outline"
            size={16}
            color="#000000"
            style={styles.bioIconInline}
          />
          {restParts ? ` | ${restParts}` : ""}
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={BG_IMAGE}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.coverContainer}>
            <ImageBackground
              source={{ uri: user.coverPic }}
              style={styles.coverImage}
              resizeMode="cover"
            >
              <View style={styles.topButtonsRow}>
                <TouchableOpacity
                  onPress={onBackPress || (() => back())}
                  style={styles.topIconBtn}
                >
                  <Ionicons name="chevron-back" size={32} color="white" />
                </TouchableOpacity>
                {isSelf && (
                  <TouchableOpacity
                    onPress={onSettingsPress}
                    style={styles.topIconBtn}
                  >
                    <View style={styles.settingsIconWrapper}>
                      <Ionicons
                        name="settings-sharp"
                        size={28}
                        color="#2533C8"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: user.profilePic }}
                  style={styles.avatar}
                />
              </View>
            </ImageBackground>
          </View>

          <View style={styles.bigCard}>
            <View style={styles.profileCard}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{displayName}</Text>
                <View style={styles.actionButtons}>
                  {isSelf ? (
                    <TouchableOpacity
                      onPress={onEditPress}
                      style={styles.editButtonInline}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color={Colors.primary}
                      />
                      <Text style={styles.actionTextInline}>Editar</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={onFollowPress}
                      style={styles.followButton}
                    >
                      <Ionicons
                        name="person-add-outline"
                        size={20}
                        color="white"
                      />
                      <Text style={styles.followButtonText}>Seguir</Text>
                    </TouchableOpacity>
                  )}
                  {isSelf && (
                    <TouchableOpacity
                      onPress={onAddPeoplePress}
                      style={styles.addButtonInline}
                    >
                      <Ionicons
                        name="person-add-outline"
                        size={22}
                        color="#007AFF"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <Text style={styles.userUsername}>@{user.username}</Text>

              {renderBioWithIcon()}

              <View style={styles.joinDateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.joinDate}>
                  {" "}
                  Se unió en {user.createdAt}
                </Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userPosts.length || 0}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.stats?.followers || 0}</Text>
                  <Text style={styles.statLabel}>Seguidores</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{user.stats?.following || 0}</Text>
                  <Text style={styles.statLabel}>Siguiendo</Text>
                </View>
              </View>

              <View style={styles.separatorLine} />

              <View style={styles.favoritesSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.titleWithIcon}>
                    <Ionicons
                      name="game-controller-outline"
                      size={22}
                      color="#000000"
                    />
                    <Text style={styles.sectionTitle}>JUEGOS FAVORITOS</Text>
                  </View>
                  {isSelf && (
                    <TouchableOpacity
                      onPress={onAddGamePress}
                      style={styles.plusButton}
                    >
                      <Ionicons
                        name="add-circle"
                        size={26}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.gamesScrollContent}
                >
                  {user.favoriteGames &&
                    user.favoriteGames.map((game: any) => (
                      <View key={game.id} style={styles.gameCard}>
                        <Image
                          source={{ uri: game.imageUrl }}
                          style={styles.gameImage}
                        />
                        <Text style={styles.gameNameLabel} numberOfLines={1}>
                          {game.name}
                        </Text>
                      </View>
                    ))}
                </ScrollView>
              </View>

              <View style={styles.separatorLine} />

              <View style={styles.feedContainer}>
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    variant="item"
                    id={post.id}
                    userName={post.authorUser?.displayName}
                    userTag="FPS"
                    userAvatar={post.authorUser?.profilePic}
                    title={post.title}
                    content={post.content}
                    imageUrl={post.media?.urls?.[0] ?? ''}
                    likes={post.likesCounter}
                    comments={post.commentsCounter}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { paddingBottom: 5 },
  coverContainer: { marginTop: 0 },
  coverImage: {
    width: "100%",
    height: 240,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  topButtonsRow: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    zIndex: 100,
  },
  topIconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
  },
  settingsIconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 2,
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -45,
    left: 20,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  bigCard: {
    backgroundColor: "rgba(204, 204, 204, 0.85)",
    borderRadius: Radii.xl,
    marginHorizontal: 0,
    marginTop: -30,
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 20,
    marginBottom: 10,
    elevation: 5,
  },
  profileCard: { backgroundColor: "transparent" },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  userName: {
    fontFamily: "Inter",
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.primary,
  },
  editButtonInline: { flexDirection: "row", alignItems: "center" },
  actionTextInline: {
    marginLeft: Spacing.xs,
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: "500",
  },
  followButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: Typography.sizes.md,
  },
  addButtonInline: { paddingLeft: 5 },
  userUsername: {
    fontSize: Typography.sizes.lg,
    color: "#000000",
    marginTop: Spacing.xs,
  },
  bioContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  userBio: { fontSize: Typography.sizes.lg, color: "#000000" },
  bioIconInline: { marginHorizontal: Spacing.xs },
  joinDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  joinDate: {
    fontSize: Typography.sizes.md,
    color: "#666",
    marginLeft: Spacing.xs,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
    marginBottom: 2,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#000000" },
  statLabel: { fontSize: Typography.sizes.md, color: "#000000", marginTop: 2 },
  separatorLine: {
    height: 1,
    backgroundColor: "#000000",
    width: "100%",
    marginVertical: 5,
    opacity: 0.2,
  },
  favoritesSection: { width: "100%" },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "bold",
    color: "#000",
  },
  plusButton: { padding: 2 },
  gamesScrollContent: { paddingRight: 20 },
  gameCard: { width: 120, marginRight: Spacing.md, alignItems: "center" },
  gameImage: {
    width: 120,
    height: 75,
    borderRadius: 6,
    backgroundColor: "#333",
    marginBottom: 6,
  },
  gameNameLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
  feedContainer: { width: "100%", marginTop: -10 },
});

export default ProfileView;
