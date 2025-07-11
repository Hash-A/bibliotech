import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { theme } from '../../styles/theme';

export default function ViewButton({ onPress, style }) {
  return (
    <Button
      mode="contained"
      icon="eye"
      style={[styles.button, style]}
      onPress={onPress}
      buttonColor={theme.colors.primary}
      textColor={theme.colors.surface}
    >
      View
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    marginBottom: 20,
  },
});