import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

export default function SearchBar({ 
  placeholder = "Search by title or author",
  onChangeText,
  value,
  style
}) {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={[styles.searchbar, style]}
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    marginTop: 60,
    marginBottom: 20,
  },
});
