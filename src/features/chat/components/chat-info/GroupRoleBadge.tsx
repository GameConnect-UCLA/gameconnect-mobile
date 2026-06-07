/** Colored badge showing group role (Owner/Admin/Member) */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GroupRole } from '../../types/chat.types';
import { Spacing, Typography } from '@/src/core/theme';

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

/** Render a colored pill for group role @param props.role - The group role enum value */
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
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  text: {
    fontSize: Typography.sizes.xs,
    fontWeight: "700",
    color: "#fff",
  },
});
