/** Section title header for notification groups. */

import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Spacing, Typography } from '@/src/core/theme'

interface SectionHeaderProps {
  title: string
}

/** Renders a section title header. @param title Section heading text */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: '#000000',
  },
})
