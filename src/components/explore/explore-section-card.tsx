import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export default function ExploreSectionCard({ icon, title, children }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    marginHorizontal: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '800',
    color: '#141414',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
});
