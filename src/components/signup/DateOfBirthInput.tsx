// components/signup/DateOfBirthInput.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  label?: string;
  value: string; // Formato DD/MM/AAAA
  onChange: (text: string) => void;
  error?: string;
}

export const DateOfBirthInput = ({ label, value, onChange, error }: Props) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[styles.textInput, error && styles.inputError]}
        placeholder="DD-MM-AAAA"
        placeholderTextColor={'gray'}
        keyboardType="numeric"
        maxLength={10}
        value={value}
        onChangeText={(text) => {
          // Formateo básico automático
          let cleaned = text.replace(/[^0-9]/g, '');
          if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
          
          let formatted = '';
          if (cleaned.length > 4) {
            formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4)}`;
          } else if (cleaned.length > 2) {
            formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
          } else {
            formatted = cleaned;
          }
          
          onChange(formatted);
        }}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
 
  label: { marginBottom: 5, fontWeight: '600', color: '#333' },
  textInput: {
    height: 40,
    padding: 5,
    marginHorizontal: 8,
    borderWidth: 1,
    minWidth: 120,
    color: "#000"
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 12, marginTop: 4 },
});