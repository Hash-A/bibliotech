import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { theme } from '../../styles/theme';

export default function AddToLibraryButton({ onPress, inLibrary, loading = false, style }) {
  const isInLibrary = inLibrary > 0;

  return (
    <Button
      mode={isInLibrary ? "outlined" : "contained"}
      icon={isInLibrary ? "check" : loading ? "progress-clock" : "plus"}
      style={[styles.button, style]}
      onPress={onPress}
      loading={loading}
      disabled={loading}
      buttonColor={isInLibrary ? theme.colors.surface : theme.colors.accent}
      textColor={isInLibrary ? theme.colors.text.secondary : theme.colors.surface}
    >
      {isInLibrary ? "Added to Library" : loading ? "Adding..." : "Add to Library"}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.border,
  },
});