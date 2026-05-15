import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useToastStore } from '@/src/store/toast.store';

export default function AppToast() {
  const { message, variant, visible } = useToastStore();

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View
        style={[
          styles.toast,
          variant === 'success' ? styles.successToast : styles.errorToast,
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  toast: {
    maxWidth: '88%',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  successToast: {
    backgroundColor: '#0E5A2F',
  },
  errorToast: {
    backgroundColor: '#B42318',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});