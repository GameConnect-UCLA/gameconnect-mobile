/** Row displaying a group member with avatar and role badge */
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { GroupMember } from '../../types/chat.types';
import GroupRoleBadge from './GroupRoleBadge';
import { Colors, Spacing } from '@/src/core/theme';

const DEFAULT_AVATAR = require("@/assets/images/default-avatar.jpg");

interface GroupMemberRowProps {
  member: GroupMember;
  onPress?: (member: GroupMember) => void;
  onLongPress?: (member: GroupMember) => void;
  disabled?: boolean;
}

/** Tappable member row with avatar, name, and role badge @param props.member - Member data @param props.onPress - Tap handler @param props.onLongPress - Long-press handler @param props.disabled - Disable interactions */
export default function GroupMemberRow({ member, onPress, onLongPress, disabled }: GroupMemberRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress?.(member)}
      onLongPress={() => onLongPress?.(member)}
      disabled={disabled || (!onPress && !onLongPress)}
      activeOpacity={0.6}
    >
      <Image
        source={member.profile_pic ? { uri: member.profile_pic } : DEFAULT_AVATAR}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{member.username ?? "Unknown"}</Text>
      </View>
      <GroupRoleBadge role={member.role} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ccc",
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
