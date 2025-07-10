import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { theme } from '../../styles/theme';

export default function AddToLibraryButton({ onPress, inLibrary, style }) {
  return (
    <Button
      mode={inLibrary ? "outlined" : "contained"}
      icon={inLibrary ? "check" : "plus"}
      style={[styles.button, style]}
      onPress={onPress}
      disabled={inLibrary}
      buttonColor={inLibrary ? theme.colors.surface : theme.colors.accent}
      textColor={inLibrary ? theme.colors.text.secondary : theme.colors.surface}
    >
      {inLibrary ? "Added to Library" : "Add to Library"}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.border,
  },
});