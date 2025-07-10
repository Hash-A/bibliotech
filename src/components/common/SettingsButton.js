import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { theme } from '../../styles/theme';

export default function SettingsButton({ onPress }) {
  return (
    <Button
      icon="cog"
      mode="outlined"
      style={styles.settingsButton}
      onPress={onPress}
      textColor={theme.colors.text.secondary}
      buttonColor={theme.colors.surface}
    >
      Settings
    </Button>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
});
