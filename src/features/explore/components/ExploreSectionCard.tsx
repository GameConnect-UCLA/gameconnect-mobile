/** Explore section card */
import React, { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Spacing, Typography } from '@/src/core/theme'

type Props = {
  icon: ReactNode
  title: string
  children: ReactNode
}

/** Card wrapper for explore sections with icon and title @param icon Section icon @param title Section title @param children Section content @returns ExploreSectionCard component */
export default function ExploreSectionCard({ icon, title, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.md,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: Spacing.sm,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 10,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: 19,
    fontWeight: '800',
    color: '#141414',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
})
