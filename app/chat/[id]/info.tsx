import React, { useState, useCallback } from "react";
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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConversation } from "@/src/hooks/chat/useConversation";
import { useGroupMembers } from "@/src/hooks/chat/use-group-members";
import { useChatInfo } from "@/src/hooks/chat/use-chat-info";
import { useChatStore } from "@/src/store/chat.store";
import { useUserStore } from "@/src/store/user.store";
import { blockUser, unblockUser } from "@/src/api/chat.api";
import ChatMediaGrid from "@/src/components/chat/chat-media-grid";
import ChatFileList from "@/src/components/chat/chat-file-list";
import ChatLinkList from "@/src/components/chat/chat-link-list";
import GroupMemberRow from "@/src/components/chat/group-member-row";
import { GroupRole } from "@/src/types/chat.types";
import type { GroupMember } from "@/src/types/chat.types";
import { ACTIVE_USERS } from "@/src/hooks/mock-data/mock-chat";

const BG = require("@/assets/images/bgbody.png");
const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

const TAB_LABELS = ["Media", "Archivos", "Enlaces"] as const;
type Tab = (typeof TAB_LABELS)[number];

export default function ChatInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: conversation, isLoading, error } = useConversation(id);
  const {
    promoteMember,
    demoteMember,
    removeMember,
    addMember,
    isPromoting,
    isDemoting,
    isRemoving,
    isAdding,
  } = useGroupMembers(id);
  const { sharedMedia, sharedFiles, sharedLinks, contactInfo, contactUserId } =
    useChatInfo(conversation);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Media");
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    null,
  );
  const [memberActionVisible, setMemberActionVisible] = useState(false);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [addMemberSelected, setAddMemberSelected] = useState<string[]>([]);

  const isGroup = conversation?.is_group ?? false;
  const displayName = conversation?.name ?? "Unknown";
  const avatarSource = conversation?.group_picture
    ? { uri: conversation.group_picture }
    : DEFAULT_AVATAR;

  const blockedUserIds = useChatStore((s) => s.blockedUserIds);
  const isContactBlocked = contactUserId
    ? blockedUserIds.includes(contactUserId)
    : false;
  const currentUserId = useUserStore((s) => s.user?.id ?? "current_user");
  const currentMember = conversation?.members?.find(
    (m) => m.user_id === currentUserId,
  );
  const isCurrentUserOwner = currentMember?.role === GroupRole.OWNER;
  const isCurrentUserAdmin =
    currentMember?.role === GroupRole.ADMIN || isCurrentUserOwner;
  const canManageRoles = isCurrentUserOwner;

  const handleMemberPress = useCallback((member: GroupMember) => {
    setSelectedMember(member);
    setMemberActionVisible(true);
  }, []);

  const handlePromote = useCallback(async () => {
    if (!selectedMember) return;
    try {
      await promoteMember(selectedMember.id);
    } catch {
      Alert.alert("Error", "Failed to promote member");
    }
    setMemberActionVisible(false);
    setSelectedMember(null);
  }, [selectedMember, promoteMember]);

  const handleDemote = useCallback(async () => {
    if (!selectedMember) return;
    try {
      await demoteMember(selectedMember.id);
    } catch {
      Alert.alert("Error", "Failed to demote member");
    }
    setMemberActionVisible(false);
    setSelectedMember(null);
  }, [selectedMember, demoteMember]);

  const handleRemoveMember = useCallback(async () => {
    if (!selectedMember) return;
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${selectedMember.username ?? "this member"} from the group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMember(selectedMember.id);
            } catch {
              Alert.alert("Error", "Failed to remove member");
            }
            setMemberActionVisible(false);
            setSelectedMember(null);
          },
        },
      ],
    );
  }, [selectedMember, removeMember]);

  const handleAddMemberToggle = useCallback((userId: string) => {
    setAddMemberSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  }, []);

  const handleAddMemberConfirm = useCallback(async () => {
    for (const userId of addMemberSelected) {
      try {
        await addMember(userId);
      } catch {
        Alert.alert("Error", `Failed to add member ${userId}`);
      }
    }
    setAddMemberSelected([]);
    setAddMemberVisible(false);
  }, [addMemberSelected, addMember]);

  const existingMemberIds = conversation?.members?.map((m) => m.user_id) ?? [];
  const availableUsers = ACTIVE_USERS.filter(
    (u) => !existingMemberIds.includes(u.id),
  );

  const handleBlockToggle = () => {
    if (!contactUserId) return;

    if (isContactBlocked) {
      Alert.alert("Unblock", "Are you sure you want to unblock this contact?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          style: "default",
          onPress: async () => {
            try {
              await unblockUser(contactUserId);
            } catch {
              Alert.alert("Error", "Failed to unblock user.");
            }
          },
        },
      ]);
    } else {
      Alert.alert("Block", "Are you sure you want to block this contact?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              await blockUser(contactUserId);
            } catch {
              Alert.alert("Error", "Failed to block user.");
            }
          },
        },
      ]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Media":
        return <ChatMediaGrid items={sharedMedia} />;
      case "Archivos":
        return <ChatFileList items={sharedFiles} />;
      case "Enlaces":
        return <ChatLinkList items={sharedLinks} />;
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
            <Text style={styles.headerTitle}>{conversation?.name}</Text>
            <View style={styles.backButton} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={avatarSource} style={styles.bigAvatar} />
            </TouchableOpacity>
            <Text style={styles.profileName}>{displayName}</Text>
            {isGroup ? (
              <Text style={styles.profileStatus}>
                {conversation?.member_count ?? 1} members
              </Text>
            ) : (
              <Text style={styles.profileStatus}>last seen recently</Text>
            )}
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chatbubble-outline" size={22} color="#1a1a1a" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Alert.alert(
                  "Mute",
                  "Esta función estará disponible próximamente.",
                )
              }
            >
              <Ionicons name="volume-mute-outline" size={22} color="#1a1a1a" />
              <Text style={styles.actionButtonText}>Mute</Text>
            </TouchableOpacity>
            {isGroup && isCurrentUserAdmin && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setAddMemberSelected([]);
                  setAddMemberVisible(true);
                }}
              >
                <Ionicons name="person-add-outline" size={22} color="#1a1a1a" />
                <Text style={styles.actionButtonText}>Add</Text>
              </TouchableOpacity>
            )}
            {!isGroup && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleBlockToggle}
              >
                <Ionicons
                  name={
                    isContactBlocked ? "remove-circle" : "remove-circle-outline"
                  }
                  size={22}
                  color={isContactBlocked ? "#d32f2f" : "#1a1a1a"}
                />
                <Text style={styles.actionButtonText}>
                  {isContactBlocked ? "Unblock" : "Block"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Alert.alert(
                  "Report",
                  "Esta función estará disponible próximamente.",
                )
              }
            >
              <Ionicons name="flag-outline" size={22} color="#1a1a1a" />
              <Text style={styles.actionButtonText}>Report</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Info Card */}
          {contactInfo && (
            <View style={styles.contactCard}>
              <View style={styles.contactRow}>
                <Ionicons name="person-outline" size={18} color="#555" />
                <Text style={styles.contactText}>{contactInfo.bio}</Text>
              </View>
              <View style={styles.contactDivider} />
              <View style={styles.contactRow}>
                <Ionicons name="at-outline" size={18} color="#555" />
                <Text style={styles.contactText}>@{contactInfo.username}</Text>
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code-outline" size={22} color="#033563" />
                </View>
              </View>
            </View>
          )}

          {/* Member List (Groups only) */}
          {isGroup && (
            <View>
              <Text style={styles.sectionTitle}>Members</Text>
              <View style={styles.membersGlassContainer}>
                {conversation?.members?.map((member) => (
                  <GroupMemberRow
                    key={member.id}
                    member={member}
                    onLongPress={
                      member.user_id !== currentUserId
                        ? handleMemberPress
                        : undefined
                    }
                  />
                ))}
              </View>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabContainer}>
            {TAB_LABELS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>{renderTabContent()}</View>
        </ScrollView>

        {/* Member Action Modal */}
        <Modal
          visible={memberActionVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setMemberActionVisible(false);
            setSelectedMember(null);
          }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setMemberActionVisible(false);
              setSelectedMember(null);
            }}
          >
            <View style={styles.actionSheetCard}>
              <Text style={styles.actionSheetTitle}>
                {selectedMember?.username ?? "Member"}
              </Text>

              {selectedMember?.role === GroupRole.MEMBER && canManageRoles && (
                <TouchableOpacity
                  style={styles.actionSheetButton}
                  onPress={handlePromote}
                  disabled={isPromoting}
                >
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={20}
                    color="#6c5ce7"
                  />
                  <Text
                    style={[styles.actionSheetButtonText, { color: "#6c5ce7" }]}
                  >
                    {isPromoting ? "Promoting..." : "Promote to Admin"}
                  </Text>
                </TouchableOpacity>
              )}

              {selectedMember?.role === GroupRole.ADMIN && canManageRoles && (
                <TouchableOpacity
                  style={styles.actionSheetButton}
                  onPress={handleDemote}
                  disabled={isDemoting}
                >
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={20}
                    color="#888"
                  />
                  <Text
                    style={[styles.actionSheetButtonText, { color: "#888" }]}
                  >
                    {isDemoting ? "Demoting..." : "Demote to Member"}
                  </Text>
                </TouchableOpacity>
              )}

              {isCurrentUserAdmin &&
                selectedMember?.user_id !== currentUserId && (
                  <TouchableOpacity
                    style={styles.actionSheetButton}
                    onPress={handleRemoveMember}
                    disabled={isRemoving}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={20}
                      color="#d32f2f"
                    />
                    <Text
                      style={[
                        styles.actionSheetButtonText,
                        { color: "#d32f2f" },
                      ]}
                    >
                      {isRemoving ? "Removing..." : "Remove from Group"}
                    </Text>
                  </TouchableOpacity>
                )}

              <TouchableOpacity
                style={[styles.actionSheetButton, styles.actionSheetCancel]}
                onPress={() => {
                  setMemberActionVisible(false);
                  setSelectedMember(null);
                }}
              >
                <Text style={styles.actionSheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Add Member Modal */}
        <Modal
          visible={addMemberVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setAddMemberVisible(false);
            setAddMemberSelected([]);
          }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setAddMemberVisible(false);
              setAddMemberSelected([]);
            }}
          >
            <TouchableOpacity style={styles.actionSheetCard} activeOpacity={1}>
              <Text style={styles.actionSheetTitle}>Add Members</Text>
              {availableUsers.length === 0 ? (
                <Text
                  style={[
                    styles.actionSheetCancelText,
                    { paddingVertical: 12 },
                  ]}
                >
                  No more users to add
                </Text>
              ) : (
                <ScrollView
                  style={styles.addMemberScrollView}
                  nestedScrollEnabled
                >
                  {availableUsers.map((user) => {
                    const isSelected = addMemberSelected.includes(user.id);
                    return (
                      <TouchableOpacity
                        key={user.id}
                        style={[
                          styles.actionSheetButton,
                          {
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0,0,0,0.08)",
                          },
                        ]}
                        onPress={() => handleAddMemberToggle(user.id)}
                      >
                        <Image
                          source={
                            user.profile_pic
                              ? { uri: user.profile_pic }
                              : DEFAULT_AVATAR
                          }
                          style={{ width: 32, height: 32, borderRadius: 16 }}
                        />
                        <Text
                          style={[styles.actionSheetButtonText, { flex: 1 }]}
                        >
                          {user.username}
                        </Text>
                        <Ionicons
                          name={isSelected ? "checkbox" : "square-outline"}
                          size={22}
                          color={isSelected ? "#033563" : "#999"}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
              {addMemberSelected.length > 0 && (
                <TouchableOpacity
                  style={[
                    styles.actionSheetButton,
                    { borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.08)" },
                  ]}
                  onPress={handleAddMemberConfirm}
                  disabled={isAdding}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#033563"
                  />
                  <Text
                    style={[styles.actionSheetButtonText, { color: "#033563" }]}
                  >
                    {isAdding
                      ? "Adding..."
                      : `Add ${addMemberSelected.length} member(s)`}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionSheetButton, styles.actionSheetCancel]}
                onPress={() => {
                  setAddMemberVisible(false);
                  setAddMemberSelected([]);
                }}
              >
                <Text style={styles.actionSheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* PFP Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1}>
              <Image source={avatarSource} style={styles.modalImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
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
  // --- Action Buttons Row ---
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minWidth: 72,
  },
  actionButtonText: {
    fontSize: 11,
    color: "#1a1a1a",
    fontWeight: "500",
    marginTop: 6,
  },
  // --- Contact Info Card ---
  contactCard: {
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  contactDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginLeft: 30,
  },
  contactText: {
    fontSize: 14,
    color: "#1a1a1a",
    marginLeft: 12,
    flex: 1,
  },
  qrPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(3, 53, 99, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  // --- Tabs ---
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#033563",
    backgroundColor: "transparent",
  },
  activeTab: {
    backgroundColor: "#033563",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#033563",
  },
  activeTabText: {
    color: "#fff",
  },
  // --- Tab Content ---
  tabContent: {
    minHeight: 200,
    marginBottom: 16,
  },
  // --- Members Section ---
  membersGlassContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    marginLeft: 16,
  },
  // --- Action Sheet ---
  actionSheetCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minWidth: "80%",
    maxHeight: "80%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionSheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  actionSheetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  actionSheetButtonText: {
    fontSize: 15,
    marginLeft: 12,
    fontWeight: "500",
  },
  actionSheetCancel: {
    justifyContent: "center",
    borderTopColor: "transparent",
  },
  actionSheetCancelText: {
    fontSize: 15,
    color: "#888",
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  addMemberScrollView: {
    maxHeight: 300,
  },
  // --- Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "85%",
    aspectRatio: 1,
    borderRadius: 16,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 48,
    right: 24,
    padding: 8,
  },
});
