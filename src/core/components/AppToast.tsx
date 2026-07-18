/** App-wide toast notification component. */
import { StyleSheet, Text, View } from 'react-native'

import { useToastStore } from '@/src/core/store/toast.store'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'

/** Floating toast that displays success/error/warning/info messages. */
export default function AppToast() {
  const { message, variant, visible } = useToastStore()

  if (!visible) {
    return null
  }

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View
        style={[
          styles.toast,
          variant === 'success' && styles.successToast,
          variant === 'error' && styles.errorToast,
          variant === 'warning' && styles.warningToast,
          variant === 'info' && styles.infoToast,
        ]}
      >
        <Text style={[styles.message, variant === 'warning' && styles.messageDark]}>{message}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 64,
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  toast: {
    maxWidth: '88%',
    paddingHorizontal: 18,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  successToast: {
    backgroundColor: Colors.status.success,
  },
  errorToast: {
    backgroundColor: Colors.status.error,
  },
  warningToast: {
    backgroundColor: Colors.status.warning,
  },
  infoToast: {
    backgroundColor: Colors.status.info,
  },
  message: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    textAlign: 'center',
  },
  messageDark: {
    color: '#1a1a1a',
  },
})
