import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { theme } from '../../styles/theme';

export default function SearchBar({ value, onChangeText, onClear }) {
  return (
    <Searchbar
      placeholder="Search books..."
      onChangeText={onChangeText}
      value={value}
      style={styles.searchbar}
      inputStyle={styles.input}
      iconColor={theme.colors.text.secondary}
      placeholderTextColor={theme.colors.text.muted}
      onIconPress={value ? onClear : undefined}
      clearIcon={value ? "close" : "magnify"}
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 0,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
});
