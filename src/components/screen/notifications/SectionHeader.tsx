import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: 'transparent', // Transparent to show background image
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000', // Black color for section titles
  },
});
