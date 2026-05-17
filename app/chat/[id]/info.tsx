import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConversation } from "@/src/hooks/chat/useConversation";
import { GroupRole } from "@/src/types/chat.types";

const BG = require("@/assets/images/bgbody.png");
const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

const RoleColors: Record<GroupRole, string> = {
  [GroupRole.OWNER]: "#FFD700",
  [GroupRole.ADMIN]: "#6c5ce7",
  [GroupRole.MEMBER]: "#888",
};

const RoleLabels: Record<GroupRole, string> = {
  [GroupRole.OWNER]: "Owner",
  [GroupRole.ADMIN]: "Admin",
  [GroupRole.MEMBER]: "Member",
};

export default function ChatInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: conversation, isLoading, error } = useConversation(id);

  const isGroup = conversation?.is_group ?? false;
  const displayName = conversation?.name ?? "Unknown";
  const avatarSource = conversation?.group_picture
    ? { uri: conversation.group_picture }
    : DEFAULT_AVATAR;

  const contact = conversation?.members?.[0];

  const handleDeadAction = (action: string) => {
    Alert.alert(action, "This feature is coming soon.");
  };

  const navigateToProfile = () => {
    if (contact?.user_id) {
      router.push(`/user/${contact.user_id}`);
    }
  };

  if (isLoading) {
    return (
      <ImageBackground source={BG} style={styles.background}>
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#033563" />
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={BG} style={styles.background}>
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading info</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.background}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerContent, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Info</Text>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image source={avatarSource} style={styles.bigAvatar} />
            <Text style={styles.profileName}>{displayName}</Text>
            {isGroup ? (
              <Text style={styles.profileStatus}>
                {conversation?.member_count ?? 1} members
              </Text>
            ) : (
              <Text style={styles.profileStatus}>last seen recently</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            {!isGroup && contact?.user_id && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={navigateToProfile}
              >
                <Ionicons name="person-outline" size={24} color="#1a1a1a" />
                <Text style={styles.actionText}>View Profile</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeadAction("Report")}
            >
              <Ionicons name="flag-outline" size={24} color="#d32f2f" />
              <Text style={[styles.actionText, styles.dangerText]}>
                {isGroup ? "Report Group" : "Report User"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeadAction("Block")}
            >
              <Ionicons name="ban-outline" size={24} color="#d32f2f" />
              <Text style={[styles.actionText, styles.dangerText]}>
                {isGroup ? "Leave Group" : "Block User"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Member List (Groups only) */}
          {isGroup && (
            <View style={styles.membersSection}>
              <Text style={styles.sectionTitle}>Members</Text>
              {conversation?.members?.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <Image
                    source={
                      member.profile_pic
                        ? { uri: member.profile_pic }
                        : DEFAULT_AVATAR
                    }
                    style={styles.memberAvatar}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.username ?? "Unknown"}
                    </Text>
                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: RoleColors[member.role] },
                      ]}
                    >
                      <Text style={styles.roleText}>
                        {RoleLabels[member.role]}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
  },
  // --- Header ---
  header: {
    backgroundColor: "rgba(210, 170, 120, 0.85)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 4,
    width: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  // --- Profile Section ---
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  bigAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 16,
  },
  profileStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  // --- Actions Section ---
  actionsSection: {
    backgroundColor: "rgba(255,255,255,0.9)",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionText: {
    fontSize: 16,
    color: "#1a1a1a",
    marginLeft: 16,
    fontWeight: "500",
  },
  dangerText: {
    color: "#d32f2f",
  },
  // --- Members Section ---
  membersSection: {
    backgroundColor: "rgba(255,255,255,0.9)",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ccc",
  },
  memberInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 12,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
});
