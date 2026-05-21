import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GroupRole } from "@/src/types/chat.types";

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

interface GroupRoleBadgeProps {
  role: GroupRole;
}

export default function GroupRoleBadge({ role }: GroupRoleBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: RoleColors[role] }]}>
      <Text style={styles.text}>{RoleLabels[role]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
});
