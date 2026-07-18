/** Modal confirm dialog component. */
import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native'
import { useConfirmDialogStore } from '@/src/core/hooks/useConfirmDialog'
import { Colors, Spacing, Radii, Typography } from '@/src/core/theme'

/** Modal confirm/cancel dialog controlled by useConfirmDialogStore. */
export function ConfirmDialog() {
  const { isOpen, options, confirm, cancel } = useConfirmDialogStore()

  React.useEffect(() => {
    if (!isOpen) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      cancel()
      return true
    })
    return () => sub.remove()
  }, [isOpen, cancel])

  if (!options) return null

  return (
    <Modal visible={isOpen} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{options.title}</Text>
          <Text style={styles.message}>{options.message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={cancel}>
              <Text style={styles.btnCancelText}>{options.cancelText ?? 'Cancelar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={confirm}>
              <Text style={styles.btnConfirmText}>{options.confirmText ?? 'Confirmar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: Radii.lg,
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  btn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.md,
  },
  btnCancel: {
    backgroundColor: Colors.surfaceDark,
  },
  btnCancelText: {
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: Typography.sizes.md,
  },
  btnConfirm: {
    backgroundColor: Colors.primary,
  },
  btnConfirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: Typography.sizes.md,
  },
})
