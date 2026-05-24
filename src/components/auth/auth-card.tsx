import { View, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function AuthCard({ children, style }: AuthCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 35,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});