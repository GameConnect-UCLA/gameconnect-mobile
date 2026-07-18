/** Empty state placeholder component for lists without data. */

import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, Spacing, Typography } from '@/src/core/theme'

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap
  title: string
  description?: string
  action?: {
    label: string
    onPress: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'alert-circle-outline',
  title,
  description,
  action,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={60} color="#999" />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? (
        <TouchableOpacity style={styles.actionButton} onPress={action.onPress}>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    marginTop: 15,
    fontSize: Typography.sizes.lg,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    fontSize: Typography.sizes.md,
    color: '#666',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionLabel: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: Typography.sizes.md,
  },
})
